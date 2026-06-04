import { Router } from "express";
import { auth, requireClassTeacher, requireTeacher } from "../middleware/auth.js";
import { addStudent, createClass } from "../controllers/class.controller.js";
import { validate } from "../middleware/validate.js";
import { addStudentSchema, createClassSchema } from "../schemas/class.schemas.js";

const classRouter: Router = Router();

classRouter.post("/class",validate(createClassSchema),auth,requireTeacher,createClass);
classRouter.post("/class/:id/add-student",validate(addStudentSchema),auth,requireTeacher,requireClassTeacher,addStudent);

