import { ClassModel, UserModel } from "../models/db.js";
import { type Request,type Response } from "express";

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

