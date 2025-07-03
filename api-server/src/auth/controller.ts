import { NextFunction, Request, Response } from "express";

export const getUserFromSession = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals.session;
  return res.send(user);
};

export const logout = async(req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.session = { user: null };
    res.clearCookie("authjs.session-token");
    res.redirect("/")
  } catch (error) {
    res.status(500).send("Sign out failed")
  }
}