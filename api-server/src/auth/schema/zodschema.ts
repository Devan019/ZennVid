import z from "zod";
import { Provider } from "../../constants/provider";

export const UserValidation = z.object({
  email : z.string().email(),
  password : z.string().min(8, "Password must be at least 8 characters long"),
  provider : z.nativeEnum(Provider).default(Provider.CREDENTIALS).optional(),
  username: z.string().min(3, "Username must be at least 3 characters long")
})

export const SignInValidation = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  provider : z.nativeEnum(Provider).default(Provider.CREDENTIALS)
})

export const CheckUserValidation = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "Otp must be 6 digits long")
})