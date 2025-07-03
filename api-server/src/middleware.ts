import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals.session;
  if (!user) {
    return res.status(401).send("Unauthorized");
  }
  next();
}