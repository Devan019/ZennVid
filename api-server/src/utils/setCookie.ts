import { Response } from "express";
import { NODE_ENV } from "../env_var";

export const SetCookie = (
  res: Response,
  key: string,
  value: any,
  time: number
) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite:
      NODE_ENV === "production" ? "none" : "lax",
    maxAge: time * 1000,
  });
};