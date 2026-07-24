export const JWT_SECRET="2100567yuhjgfdrew3806"


import { z } from "zod";

export const signupZodSchema = z.object({
  firstname: z
    .string()
    .min(2, "Must be at least 2 characters")
    .max(20, "Firstname is too long"),

  lastname: z
    .string()
    .min(2, "Must be at least 2 characters")
    .max(20, "Lastname is too long"),

  email: z.email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "At least 6 characters")
    .max(50)
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number"),
});


export const signinZodSchema = z.object({
    email: z.email("Enter a valid email address"),
    password : z.string()
})