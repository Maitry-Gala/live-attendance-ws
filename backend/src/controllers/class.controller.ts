import { tr } from "zod/locales";
import { ClassModel, UserModel ,Role, AttendanceModel} from "../models/db.js";
import { type Request,type Response } from "express";
import { setActiveSession } from "../types/session.js";
import { string, success } from "zod";


export const createClass = async (req: Request, res: Response) => {
  const { className } = req.body;

  try {
    const classroom = await ClassModel.create({
      className,
      teacherId: req.userId!,
      studentIds: [],
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: classroom._id,
        className: classroom.className,
        teacherId: classroom.teacherId,
        studentIds: classroom.studentIds,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};


export const addStudent = async (req: Request, res: Response) => {
  const classId = req.params.id;
  const { studentId } = req.body;

  try {
    const classroom = await ClassModel.findById(classId);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    const student = await UserModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    classroom!.studentIds.push(student._id);

    await classroom!.save();

    return res.status(200).json({
      success: true,
      data: {
        _id: classroom!._id,
        className: classroom!.className,
        teacherId: classroom!.teacherId,
        studentIds: classroom!.studentIds,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

export const getClass = async (req: Request, res: Response) => {
  const classId = req.params.id;

  try {
    const classroom = await ClassModel.findById(classId)
      .populate("studentIds", "_id name email");

    if (!classroom) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: classroom._id,
        className: classroom.className,
        teacherId: classroom.teacherId,
        students: classroom.studentIds,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};


export const getStudents = async (req: Request, res: Response) => {
  try{
  const students = await UserModel.find(
  { role: Role.student },
  "_id name email"
);

    return res.status(200).json({
      success: true,
      data: students
    });
  }catch (e) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
}

export const getAttendance = async (req: Request, res: Response) => {
  const classId = req.params.id as string;

  try{
    const studentId = req.userId!;

    const record = await AttendanceModel.findOne({
      classId,
      studentId,
    });

    if (!record) {
      return res.status(200).json({
        success: true,
        data: {
          classId,
          status: null,
        },
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        classId,
        status: record ? record.status : null,
      },
    });

  }catch (e) {
     return res.status(500).json({ success: false, error: "Something went wrong" });
  }
}

export const startAttendance =  async (req: Request, res: Response) => {
  const { classId } = req.body;
  try{
    const startedAt = new Date().toISOString();

    setActiveSession({
      classId,
      startedAt,
      attendance: {},
    });

    return res.status(200).json({
      success: true,
      data: {
        classId,
        startedAt,
      },
    });

  }catch(e) {
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
}