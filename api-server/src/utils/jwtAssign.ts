import jwt from "jsonwebtoken";
import { AUTH_SECRET } from "../env_var";
import ExpressError from "./ExpressError";
export interface JWTPayload {
  id: string;
  email: string;
  provider: string;
  username: string;
}
export const generateJWTtoken = (payload: JWTPayload) => {
  const { id, email, provider, username } = payload;
  if (!id || !email || !provider || !username) {
    throw new ExpressError(400, "Invalid payload for JWT generation");
  }
  if (typeof id !== "string" || typeof email !== "string" || typeof provider !== "string" || typeof username !== "string") {
    throw new ExpressError(400, "Invalid payload types for JWT generation");
  }

  if (!AUTH_SECRET) {
    throw new ExpressError(500, "Authentication secret is not defined");
  }

  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}