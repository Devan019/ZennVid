import { NextFunction, Request, Response } from "express";
import { formatResponse } from "./utils/formateResponse";
import expressAsyncHandler from "./utils/expressAsync";
import jwt from "jsonwebtoken";
import { ACCESS_KEY } from "./env_var";
import { UserRole } from "./constants/provider";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        provider: string;
        username: string;
        credits : number;
        profilePicture : string;
        role : UserRole;
      }
    }
  }
}


export const isAuthenticated = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  const { access_token } = req.cookies;

  // 1. No token? 401 Unauthorized
  if (!access_token) {
    return formatResponse(res, 401, "Access token missing", false, null);
  }

  // 2. Try to verify
  try {
    const decoded = jwt.verify(access_token, ACCESS_KEY ?? "");
    req.user = decoded as any;
    return next(); // done
  } catch (error) {
    // 3. Token expired or tampered with? 401 Unauthorized
    return formatResponse(res, 401, "Access token invalid or expired", false, null);
  }
});