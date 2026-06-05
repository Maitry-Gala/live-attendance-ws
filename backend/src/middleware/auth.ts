import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ClassModel } from "../models/db.js";


export const auth = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token!, secret) as any;

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }
};

export const requireTeacher = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.role != "teacher") {
    return res.status(403).json({
      success: false,
      error: "Forbidden, teacher access required",
    });
  }

  next();
};

export const requireClassTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const classroom = await ClassModel.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden, not class teacher",
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

export const requireClassAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const classId = req.params.id;

  try {
    const classroom = await ClassModel.findById(classId);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    const isTeacher =
      classroom.teacherId.toString() === req.userId;

    const isStudent =
      classroom.studentIds.some(
        (s: any) => s._id.toString() === req.userId
      );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

export const studentaccess = async (req: Request,
  res: Response,
  next: NextFunction) => {
    const classId = req.params.id;
    try{
      if (req.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Forbidden, teacher access required",
      });
    }    

    const classroom = await ClassModel.findById (classId);

    if(!classroom){
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    const isEnrolled = classroom.studentIds
      .some((id) => id.toString() === req.userId);

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
      });
    }
    next();

  }catch (e) {
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }  
}