import { NextFunction, Request, Response } from "express";
import { formatResponse } from "./utils/formateResponse";
import expressAsyncHandler from "./utils/expressAsync";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}
export const isAuthenticated = expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return formatResponse(res, 401, "Unauthorized", false, null, "You must be logged in to access this resource");
  }
  const {user} = jwt.decode(token) as { user: { id: string, email: string } };
  if (!user) {
    return formatResponse(res, 401, "Unauthorized", false, null, "Invalid token");
  } else if (user.id && user.email) {
    req.user = user;
  }
  return next();
})