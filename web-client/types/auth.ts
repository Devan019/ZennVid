import { z } from "zod"
import { object, string }  from "zod"
// export enum Role{
//   ADMIN = 'admin',
//   USER = 'user'
// }

export enum Providers{
  GOOGLE = 'google',
  INSAGRAM = "instagram",
  X = "twitter",
  META = "facebook",
  APPLE = "apple",
  CREDENTIALS = "credentials"
}
 
export const signInSchema = object({
  email: string().optional(),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  // role : z.nativeEnum(Role).default(Role.USER)
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
  // role: z.nativeEnum(Role).default(Role.USER)
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