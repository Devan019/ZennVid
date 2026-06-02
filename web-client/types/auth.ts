import { z } from "zod"
import { object, string }  from "zod"


export enum Providers{
  GOOGLE = 'google',
  CREDENTIALS = "credentials"
}
 
export const signInSchema = object({
  email: string().optional(),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const oauthSchema = object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  name: z.string({required_error : "Name is required"}),
  provider : z.nativeEnum(Providers)
})