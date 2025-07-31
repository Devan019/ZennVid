import { Response } from "express";

export const SetCookie = (res: Response, key: string, value: any) => {
  console.log("Setting cookie:", key, value);
  res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
}