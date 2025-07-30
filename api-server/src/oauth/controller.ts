import { Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { getGoogleAuthUrl, getOAuthUser, resetOAuthClient } from "./service";
import { formatResponse } from "../utils/formateResponse";
import jwt from "jsonwebtoken";
import { AUTH_SECRET } from "../env_var";
import { generateJWTtoken } from "../utils/jwtAssign";
import { User } from "../auth/model/User";
import { Provider } from "../constants/provider";
import connectToMongo from "../utils/mongoConnection";

export const loginWithGoogle = expressAsyncHandler((req: Request, res: Response) => {
  try {
    const authUrl = getGoogleAuthUrl();
    return res.redirect(authUrl);
  } catch (error) {
    return formatResponse(res, 500, "Failed to generate Google auth URL", false, "Error ");
  }
})

export const oauthCallback = expressAsyncHandler(async (req: Request, res: Response) => {
  const { code } = req.query;
  if (typeof code !== "string") {
    return formatResponse(res, 400, "Invalid request", false, "Error ");
  }

  try {
    const { data } = await getOAuthUser(code);
    if (!AUTH_SECRET) {
      console.log("Authentication secret is not defined");

      return formatResponse(res, 500, "Authentication secret not configured", false, "Error ");
    }

    await connectToMongo();

    const user = await User.findOne({ email: data.email });
    console.log("User found:", user);
    if (user.provider !== Provider.GOOGLE) {
      resetOAuthClient()
      return formatResponse(res, 400, "User already exists with different provider", false, "Error ");
    }

    if (!user) {
      const newUser = new User({
        email: data.email,
        username: data.name,
        provider: Provider.GOOGLE,
        profilePicture: data.picture
      });
      await newUser.save();
    }

    const token = generateJWTtoken({
      userId: user._id.toString(),
      email: user.email,
      provider: user.provider,
      username: user.username
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return formatResponse(res, 200, "User authenticated successfully", true, { user: data });
  } catch (error: any) {
    if (error.message.includes("invalid_grant")) {
      console.log("Code expired or already used. Redirecting...");
      resetOAuthClient();
      return res.redirect("/oauth/login/google");
    }
    return formatResponse(res, 500, "Failed to authenticate user", false, "Error ");
  }
});