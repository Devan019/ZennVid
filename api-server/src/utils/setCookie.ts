import { Response } from "express";

export const SetCookie = (res: Response, key: string, value: any, time: number) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: time
  });
}