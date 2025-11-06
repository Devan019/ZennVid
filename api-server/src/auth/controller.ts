import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import { CreateAdminService, createTmpUserService, createUserService, getAllUsersAsCSVService, GetUserByIdService,  GetUserByTokenService,  signInUserService } from "./service";
import { CheckUserValidation, SignInValidation, UserValidation } from "./schema/zodschema";
import { TmpUser } from "./model/tmpUser";
import { ISendResponse } from "../constants/interfaces";
import { SetCookie } from "../utils/setCookie";

export const createUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, provider, username } = UserValidation.parse(req.body);
    const response: ISendResponse = await createTmpUserService({ email, password, provider: provider ?? "CREDENTIALS", username });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const checkUser = expressAsyncHandler((async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = CheckUserValidation.parse(req.body);

    const user = await TmpUser.findOne({ email, otp });
    if (!user) {
      return formatResponse(res, 404, "otp invalid", false, null);
    }
    const response: ISendResponse = await createUserService(user);
    await TmpUser.deleteOne({ _id: user._id });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
}))

export const signInUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, provider } = SignInValidation.parse(req.body);
    const response: ISendResponse = await signInUserService({ email: email ?? "", password, provider });

    if(!response.success){
      return formatResponse(res, response.status, response.message, response.success, response.data);
    }
    SetCookie(res, "token", response.data.token, 60 * 60 * 24 * 7); // 7 days

    const user = response.data.user;

    const sendUser = {
      _id: user._id,
      email: user.email,
      provider: user.provider,
      username: user.username,
      role : user.role
    }

    req.user = {
      id: user._id,
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits: user.credits,
      profilePicture: user.profilePicture,
      role : user.role
    }
    return formatResponse(res, response.status, response.message, response.success, { user: sendUser });
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const getUserFromSession = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    const response: ISendResponse = await GetUserByTokenService(token);
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
});

export const logout = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return formatResponse(res, 200, "User logged out successfully", true, null);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, null);
  }
})

export const CreateAdmin = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username } = req.body;
    const response: ISendResponse = await CreateAdminService({ email, password, username });
    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})