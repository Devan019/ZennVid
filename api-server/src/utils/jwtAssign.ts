import jwt from "jsonwebtoken";
import ExpressError from "./ExpressError";

export const generateJWTtoken = (
  payload: any,
  secret: string,
  expiresIn: jwt.SignOptions["expiresIn"]
) => {
  if (!secret || !expiresIn) {
    throw new ExpressError(500, "Authentication secret or expiration time is not defined");
  }

  return jwt.sign(payload, secret, { expiresIn });
}

