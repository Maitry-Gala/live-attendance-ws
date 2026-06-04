import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ClassModel } from "../models/db.js";
const jwtSecret = process.env.JWT_SECRET!;

interface JwtPayload {
  userId: string;
  role: "teacher" | "student";
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (e) {
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
  const id = req.params.classId;
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
