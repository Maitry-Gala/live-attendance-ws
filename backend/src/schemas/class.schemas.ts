import { z } from "zod";

export const createClassSchema = z.object({
  className: z.string().min(1, "Class name is required"),
});

export const addStudentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
});