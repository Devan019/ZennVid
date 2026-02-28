import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../../../utils/expressAsync";
import { UserCreationValidation, UserUpdateValidation } from "./schema";
import { formatResponse } from "../../../utils/formateResponse";
import { createUserService, DeleteUserService, getAllUsersAsCSVService, GetAllUserService, GetUserByIdService, UpdateUserService } from "../../../auth/service";
import { ISendResponse, IUser } from "../../../constants/interfaces";
import { paginationSchema } from "../analisys/schema";

export const createUser = expressAsyncHandler(async(req: Request, res: Response) => {
  try {
    const { email, password, provider, username } = UserCreationValidation.parse(req.body);
    const user:IUser = {
      email,
      password,
      provider : provider ?? "CREDENTIALS",
      username,
    }
    const response:ISendResponse = await createUserService(user);
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 400, "Invalid user data", false, error);
  }
})

export const getAllUsers = expressAsyncHandler(async(req: Request, res: Response) => {
  try {
    const { page, limit, createdAt, search } = paginationSchema.parse(req.body);
    const users:ISendResponse = await GetAllUserService({ page, limit, search, createdAt });
    return formatResponse(res, users.status, users.message, users.success, users.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const updateUser = expressAsyncHandler(async(req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body, " id " + req.params.id);
    const { username, credits } = UserUpdateValidation.parse(req.body);
    const userId = req.params.id;
    const response:ISendResponse = await UpdateUserService(userId as string, username, credits);
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const getUser = expressAsyncHandler(async(req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user:ISendResponse = await GetUserByIdService(userId as string);
    if (!user) {
      return formatResponse(res, 404, "User not found", false, null);
    }
    return formatResponse(res, user.status, user.message, user.success, user.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const deleteUser = expressAsyncHandler(async(req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deleteResponse: ISendResponse = await DeleteUserService(userId as string);
    return formatResponse(res, deleteResponse.status, deleteResponse.message, deleteResponse.success, null);
  }
  catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const CSVUsers = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {

    const response: ISendResponse = await getAllUsersAsCSVService();
    return formatResponse(res, response.status, response.message, response.success, response.data);
  }
  catch (error) {
    console.log("Error in CSVUsers controller:", error);
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});
