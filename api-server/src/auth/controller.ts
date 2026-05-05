import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import { CreateAdminService, createTmpUserService, createUserService, getAllUsersAsCSVService, GetUserByIdService, GetUserByTokenService, signInUserService } from "./service";
import { CheckUserValidation, SignInValidation, UserValidation } from "./schema/zodschema";
import { ISendResponse } from "../constants/interfaces";
import { SetCookie } from "../utils/setCookie";
import { redisClient } from "../utils/redisClient";
import { generateJWTtoken } from "../utils/jwtAssign";

interface CacheUser {
  email: string,
  password: string,
  provider: string,
  username: string,
  otp: string
}

const autoSignInUserService = (req: Request, res: Response, user: any) => {
  try {
    //gen token
    const token = generateJWTtoken({
      id: user._id.toString(),
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits: user.credits,
      role: user.role,
    });

    SetCookie(res, "token", token, 60 * 60 * 24 * 7); // 7 days

    const sendUser = {
      _id: user._id,
      email: user.email,
      provider: user.provider,
      username: user.username,
      role: user.role
    }

    req.user = {
      id: user._id,
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits: user.credits,
      profilePicture: user.profilePicture,
      role: user.role
    }
    return formatResponse(res, 200, "User signed in successfully", true, { user: sendUser });
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
}

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

    const userobj: string | null = await redisClient.get(`tmp_user_${email}`);

    //check user by email
    if (!userobj) {
      return formatResponse(res, 404, "otp invalid", false, null);
    }

    const user: CacheUser = JSON.parse(userobj);

    //check user by otp
    if (user.otp !== otp) {
      return formatResponse(res, 400, "otp invalid", false, null);
    }

    //save user to db
    const response: ISendResponse = await createUserService(user);

    //delete tmp user from redis
    await redisClient.del(`tmp_user_${email}`);

    //auto sign in user after create account
    if (response.success) {
      return autoSignInUserService(req, res, response.data.user);
    }

    return formatResponse(res, response.status, response.message, response.success, response.data);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
}))

export const signInUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, provider } = SignInValidation.parse(req.body);
    const response: ISendResponse = await signInUserService({ email: email ?? "", password, provider });

    if (!response.success) {
      return formatResponse(res, response.status, response.message, response.success, response.data);
    }

    return autoSignInUserService(req, res, response.data.user);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const getUserFromSession = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    const response: ISendResponse = await GetUserByTokenService(token);

    //check if 404
    if (response.status === 404) {
      //delete cookie (fallback)
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
    }

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