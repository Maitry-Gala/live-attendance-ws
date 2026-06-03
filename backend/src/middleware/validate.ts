import z from "zod";
import { type Request,type Response, type NextFunction } from "express";
import { formatZodErrors } from "../utils/formatZodErrors.js";

export const validate = (schema: z.ZodSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: formatZodErrors(result.error.issues)
            });
        }

        req.body = result.data;
        next();
    };
