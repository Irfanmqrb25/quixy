import * as z from "zod";

export const authSignUpSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 5 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[A-Z]).{8,}$/, {
      message: "Password must contain at least one uppercase letter.",
    }),
});

export const authSignInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[A-Z]).{8,}$/, {
      message: "Password must contain at least one uppercase letter.",
    }),
});
