import z from "zod";
import { Provider } from "../../constants/provider";

export const UserValidation = z.object({
  email : z.string().email(),
  username: z.string(),
  password : z.string().min(8, "Password must be at least 8 characters long").optional(),
  provider : z.nativeEnum(Provider).default(Provider.CREDENTIALS).optional()
})

export const SignInValidation = z.object({
  username : z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  provider : z.nativeEnum(Provider).default(Provider.CREDENTIALS)
})