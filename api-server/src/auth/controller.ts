import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import { CreateAdminService, createTmpUserService, createUserService, GetUserByTokenService, signInUserService } from "./service";
import { CheckUserValidation, SignInValidation, UserValidation } from "./schema/zodschema";
import { ISendResponse } from "../constants/interfaces";
import { SetCookie } from "../utils/setCookie";
import { redisClient } from "../utils/redisClient";
import { generateJWTtoken } from "../utils/jwtAssign";
import { ACCESS_KEY, FRONTEND_URL, REFRESH_KEY, REFRESH_SECRET } from "../env_var";
import { UserRole } from "../constants/provider";
import { RefreshToken } from "./model/RefreshToken";
import { sha256Hex } from "../utils/cyrpto";
import jwt from "jsonwebtoken";

interface CacheUser {
  email: string,
  password: string,
  provider: string,
  username: string,
  otp: string
}

export const autoSignInUserService = async (req: Request, res: Response, user: any, isOauth?: boolean) => {
  try {
    if (!ACCESS_KEY || !REFRESH_KEY || !REFRESH_SECRET) {
      throw new Error("Authentication keys are not defined");
    }
    //payload
    const payload = {
      id: user._id.toString(),
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits: user.credits,
      role: user.role as UserRole,
    }

    //gen access token and setcookie
    const access_token = generateJWTtoken(payload, ACCESS_KEY, "5m");
    SetCookie(res, "access_token", access_token, 5 * 60 * 1000); // 5 minutes - in miliseconds

    //gen refresh token and cookie
    const refresh_token = generateJWTtoken({
      id: user._id.toString(),
    }, REFRESH_KEY, "7d");
    SetCookie(res, "refresh_token", refresh_token, 7 * 24 * 60 * 60 * 1000); // 7 days - in miliseconds

    //set in db
    //hashed the refresh token before saving to db for security
    const hashedRefreshToken = await sha256Hex(refresh_token);

    await RefreshToken.create({
      user: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })


    //if ouath then redirect to frontend with token in cookie, if credentials then send response with token in cookie
    if (isOauth) {
      return res.redirect(`${FRONTEND_URL}`);
    }

    return formatResponse(res, 200, "User signed in successfully", true, { user: payload });
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
    const token = req.cookies.access_token;
    const response: ISendResponse = await GetUserByTokenService(token);

    //check if 404
    if (response.status === 404) {
      //delete cookie (fallback)
      res.clearCookie("access_token", {
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
    //get user id from refresh token
    const refresh_token = req.cookies.refresh_token;

    //decode
    const decoed = jwt.verify(refresh_token, REFRESH_KEY ?? "");

    //id
    const userId = (decoed as any).id;

    //delete refresh token from db
    await RefreshToken.deleteMany({ user: userId });

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.clearCookie("refresh_token", {
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