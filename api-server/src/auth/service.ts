import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import connectToMongo from "../utils/mongoConnection";
import { CheckUserValidation, SignInValidation, UserValidation } from "./schema/zodschema";
import { User } from "./model/User";
import { formatResponse } from "../utils/formateResponse";
import { TmpUser } from "./model/tmpUser";
import { getOtp } from "../utils/OptGenerater";
import { Provider } from "../constants/provider";
import bcrypt from "bcrypt"
import { passwordCompare } from "../utils/passwordCompare";
import { AUTH_SECRET } from "../env_var";
import jwt from "jsonwebtoken"
import { sendMail } from "../utils/SendMail";
import { generateJWTtoken } from "../utils/jwtAssign";
import { SetCookie } from "../utils/setCookie";

export const createUserService = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const { email, password, provider, username } = UserValidation.parse(req.body);

    const exitsUser = await User.findOne({ email });
    const tmpExitsUser = await TmpUser.findOne({ email });
    if (exitsUser) {
      return formatResponse(res, 400, "User already exists", false, null);
    }


    const otp = getOtp();
    if (tmpExitsUser) {
      await TmpUser.deleteOne({ _id: tmpExitsUser._id })
    }
    const encodePassword = await bcrypt.hash(password, 10);
    const newUser = new TmpUser({
      email,
      password: encodePassword,
      provider: provider || Provider.CREDENTIALS,
      otp,
      username
    });

    await newUser.save();

    await sendMail({
      from: "onboarding@resend.dev",
      to: email,
      subject: "ZennVid - Verify your email",
      html: `<p>Hi, ${username} </p>
             <p>Thank you for signing up on ZennVid. Please verify your email by entering the following OTP:</p>
             <h2>${otp}</h2>
             <p>If you did not request this, please ignore this email.</p>
             <p>Best regards,</p>
             <p>ZennVid Team</p>`
    })

    return formatResponse(res, 200, "Otp send !!!", true, {
      user: {
        email: email,
        _id: newUser._id,
        provider: newUser.provider,
        username: newUser.username
      }
    });

  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})

export const checkUserService = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const { email, otp } = CheckUserValidation.parse(req.body);

    const user = await TmpUser.findOne({ email, otp });
    if (!user) {
      return formatResponse(res, 404, "otp invalid", false, null);
    }
    const newUser = new User({
      email: user.email,
      password: user.password,
      provider: user.provider,
      username: user.username
    });
    await newUser.save();

    await TmpUser.deleteOne({ _id: user._id });
    return formatResponse(res, 200, "User created successfully", true, { user: newUser });
  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, null);
  }
})

export const signInUserService = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const { email, password, provider } = SignInValidation.parse(req.body);

    const user = await User.findOne({
      email
    });

    const passwordMatch = await passwordCompare(password, user.password);

    if (!user || !(passwordMatch)) {
      return formatResponse(res, 401, "Invalid credentials", false, null);
    }

    if (user.provider !== provider) {
      return formatResponse(res, 409, "Provider mismatch", false, null);
    }

    // Here you would typically create a session or JWT token

    const token = generateJWTtoken({
      id: user._id.toString(),
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits : user.credits
    });

    SetCookie(res, "token", token, 60 * 60 * 24 * 7); // 7 days

    const sendUser = {
      _id: user._id,
      email: user.email,
      provider: user.provider,
      username: user.username
    }

    req.user = {
      id: user._id,
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits : user.credits,
      profilePicture: user.profilePicture
    }

    return formatResponse(res, 200, "User signed in successfully", true, { user: sendUser });

  } catch (error) {
    console.log(error)
    return formatResponse(res, 500, "Internal server error", false, error);
  }
})


export const logoutUserService = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

export const getUserService = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToMongo();
    const token = req.cookies.token;
    if (!token) {
      return formatResponse(res, 401, "Unauthorized", false, null);
    }

    const decoded = jwt.verify(token, AUTH_SECRET ?? "");
    const user = await User.findById((decoded as any).id).select("-password");

    if (!user) {
      return formatResponse(res, 404, "User not found", false, null);
    }

    return formatResponse(res, 200, "User retrieved successfully", true, { user });

  } catch (error) {
    return formatResponse(res, 500, "Internal server error", false, null);
  }
})