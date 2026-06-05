import { Router } from "express";
import { auth, requireClassAccess, requireClassTeacher, requireTeacher, studentaccess } from "../middleware/auth.js";
import { addStudent, createClass, getAttendance, getClass, getStudents, startAttendance } from "../controllers/class.controller.js";
import { validate } from "../middleware/validate.js";
import { addStudentSchema, createClassSchema, startAttendanceSchema } from "../schemas/class.schemas.js";

export const classRouter: Router = Router();

classRouter.post("/class",validate(createClassSchema),auth,requireTeacher,createClass);

classRouter.post("/class/:id/add-student",validate(addStudentSchema),auth,requireTeacher,requireClassTeacher,addStudent);

classRouter.get("/class:id",auth,requireClassAccess,getClass);

classRouter.get("/students",auth,requireTeacher,getStudents);

classRouter.get("/class/:id/my-attendance",auth,studentaccess,getAttendance);

classRouter.post("/attendance/start",validate(startAttendanceSchema),auth,requireClassTeacher,startAttendance);