import { NextFunction, Request, Response } from "express";
import { formatResponse } from "./utils/formateResponse";
import expressAsyncHandler from "./utils/expressAsync";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        provider: string;
        username: string;
      }
    }
  }
}
export const isAuthenticated = expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return formatResponse(res, 401, "Unauthorized", false, null, "You must be logged in to access this resource");
  }
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded === 'string') {
    return formatResponse(res, 401, "Unauthorized", false, null, "Invalid token");
  }
  
  req.user = {
    id: decoded.id as string,
    email: decoded.email as string,
    provider: decoded.provider as string,
    username: decoded.username as string
  };
  return next();
})