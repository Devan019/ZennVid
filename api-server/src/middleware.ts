import { NextFunction, Request, Response } from "express";
import { formatResponse } from "./utils/formateResponse";
import expressAsyncHandler from "./types/expressAsync";

export const isAuthenticated = expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return formatResponse(res, 401, "Unauthorized", false, null, "You must be logged in to access this resource");
  } else {
    return next();
  }
})