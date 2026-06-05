import z  from "zod";

export const signupSchema = z.object({
  name: z.string().min(3).max(10),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(10)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%*?&])[A-Za-z\d@!$%*?&]+$/),
  role: z.union([z.literal('teacher'),z.literal('student')])
});

export const signinSchema = z.object({
  email: z.string().min(3).max(25).email(),
  password: z
    .string()
    .min(6)
    .max(10)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%*?&])[A-Za-z\d@!$%*?&]+$/),
});

