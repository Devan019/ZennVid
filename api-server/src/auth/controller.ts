import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import { checkUserService, createUserService, getUserService, logoutUserService, signInUserService } from "./service";
export const createUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await createUserService(req, res, next);
    return response;
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const checkUser = expressAsyncHandler((async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await checkUserService(req, res, next);
    return response;
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
}))

export const signInUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await signInUserService(req, res, next);
    return response;
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const getUserFromSession = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getUserService(req, res, next);
    return response;
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});

export const logout = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await logoutUserService(req, res, next);
    return response;
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})