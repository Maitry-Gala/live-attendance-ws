import z from "zod";
import { type Request,type Response, type NextFunction } from "express";

export const validate = (schema: z.ZodSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: "Invalid request schema",
            });
        }

        req.body = result.data;
        next();
    };
