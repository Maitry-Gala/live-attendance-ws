import { z } from "zod";

export const formatZodErrors = (issues: z.ZodIssue[]) => {
    const errors: Record<string, string[]> = {};

    for (const err of issues) {
        const field = err.path[0] as string;

        if (!errors[field]) {
            errors[field] = [];
        }

        errors[field].push(err.message);
    }

    return errors;
};