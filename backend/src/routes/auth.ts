import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { signinSchema, signupSchema } from "../schemas/user.schemas.js";
import { signinUser, signupUser,getUser } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js";

export const userRouter: Router = Router();

userRouter.post("/signup",validate(signupSchema),signupUser);
userRouter.post("/signin",validate(signinSchema),signinUser);
userRouter.get("/me",auth,getUser);
