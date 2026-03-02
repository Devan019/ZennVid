import { Response } from "express";
import { IS_PROD, DOMAIN } from "../env_var";

export const SetCookie = (
  res: Response,
  key: string,
  value: any,
  time: number
) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite:
      IS_PROD ? "none" : "lax",
    maxAge: time * 1000,
    domain: DOMAIN
  });
};