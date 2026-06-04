import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { formatResponse } from "../utils/formateResponse";
import { createTmpUserService, createUserService, GetUserByTokenService, signInUserService } from "./service";
import { CheckUserValidation, SignInValidation, UserValidation } from "./schema/zodschema";
import { ISendResponse } from "../constants/interfaces";
import { SetCookie } from "../utils/setCookie";
import { redisClient } from "../utils/redisClient";
import { generateJWTtoken } from "../utils/jwtAssign";
import { ACCESS_KEY, accessPeroid, accessPeroidJwt, FRONTEND_URL, REFRESH_KEY, REFRESH_SECRET, refreshPeroid, refreshPeroidJwt, IS_PROD } from "../env_var";
import { RefreshToken } from "./model/RefreshToken";
import { sha256Hex } from "../utils/cyrpto";
import jwt from "jsonwebtoken";
import { User } from "./model/User";
import { v4 as uuidv4 } from "uuid";

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
    }

    //gen access token and setcookie
    const access_token = generateJWTtoken(payload, ACCESS_KEY, accessPeroidJwt);
    SetCookie(res, "access_token", access_token, accessPeroid); // 5 minutes - in miliseconds

    //create new session id
    const sessionId = uuidv4();

    //gen refresh token and cookie
    const refresh_token = generateJWTtoken({
      id: user._id.toString(),
      sessionId
    }, REFRESH_KEY, refreshPeroidJwt);
    SetCookie(res, "refresh_token", refresh_token, refreshPeroid); // 7 days - in miliseconds

    //set in db
    //hashed the refresh token before saving to db for security
    const hashedRefreshToken = await sha256Hex(refresh_token);

    //create new token
    await RefreshToken.create({
      sessionId,
      user: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + refreshPeroid) // 7 days
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
    // if (response.status === 404) {
    //   //delete cookie (fallback)
    //   res.clearCookie("access_token", {
    //     httpOnly: true,
    //     secure: IS_PROD,
    //     sameSite: "strict"
    //   });
    // }

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
    const sessionId = (decoed as any).sessionId;

    //delete refresh token from db
    await RefreshToken.deleteOne({ user: userId, token: await sha256Hex(refresh_token), sessionId });

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict"
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict"
    });

    return formatResponse(res, 200, "User logged out successfully", true, null);
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, null);
  }
})

export const revokeToken = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get refresh token from cookie
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return formatResponse(res, 401, "Unauthorized", false, null);
    }

    // 2. Verify Refresh Token math
    const decodedRefresh = jwt.verify(refresh_token, REFRESH_KEY ?? "") as any;
    const { id, sessionId } = decodedRefresh;

    if (!id) return formatResponse(res, 401, "Unauthorized", false, null);

    // 3. Hash the incoming token BEFORE querying the database
    const hashedIncoming = await sha256Hex(refresh_token);

    // 4. Check DB for this SPECIFIC session
    const tokenRecord = await RefreshToken.findOne({
      user: id,
      sessionId: sessionId
    });

    if (!tokenRecord) {
      // If we don't find the token, it means it's either expired, logged out, or invalid.
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict"
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict"
      });
      return formatResponse(res, 401, "Unauthorized", false, null);
    }

    //session is same but token is diff, means stolen token
    if (tokenRecord.token !== hashedIncoming) {
      //delete session from db to revoke all tokens of that session
      await RefreshToken.deleteOne({ user: id, sessionId: sessionId });

      //clear cookies
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict"
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict"
      });
      return formatResponse(res, 401, "Unauthorized", false, null);
    }


    // 5. User details
    const userDetails = await User.findById(id).select("-password").lean();
    const userDoc = Array.isArray(userDetails) ? userDetails[0] : userDetails;

    if (!userDoc) {
      return formatResponse(res, 404, "User not found", false, null);
    }

    // 6. Create the clean payload 
    const payload = {
      id: String(userDoc._id),
      email: userDoc.email,
      provider: userDoc.provider,
      username: userDoc.username,
      credits: userDoc.credits,
      profilePicture: userDoc.profilePicture
    };

    // 7. Generate NEW Access Token
    const newAccessToken = jwt.sign(payload, ACCESS_KEY ?? "", { expiresIn: accessPeroidJwt });
    SetCookie(res, "access_token", newAccessToken, accessPeroid);

    // 8. Generate NEW Refresh Token
    const remainingTime = tokenRecord.expiresAt.getTime() - Date.now();
    const newRefreshToken = jwt.sign({ id, sessionId }, REFRESH_KEY ?? "", { expiresIn: `${remainingTime}ms` });
    SetCookie(res, "refresh_token", newRefreshToken, remainingTime);

    // 9. Update the CURRENT session's token in DB
    const hashedNewRefreshToken = await sha256Hex(newRefreshToken);
    tokenRecord.token = hashedNewRefreshToken;
    await tokenRecord.save();

    // 10. Attach to request
    req.cookies.access_token = newAccessToken;
    req.cookies.refresh_token = newRefreshToken;
    req.user = payload;

    return formatResponse(res, 200, "Token refreshed successfully", true, null);

  } catch (refreshError) {
    return formatResponse(res, 401, "Session expired. Please log in again.", false, null);
  }
});