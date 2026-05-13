import { Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { getGoogleAuthUrl, getOAuthUser, getTokens } from "./service";
import { formatResponse } from "../utils/formateResponse";
import { User } from "../auth/model/User";
import { Provider, UserRole } from "../constants/provider"
import { autoSignInUserService } from "../auth/controller";


export const loginWithGoogle = expressAsyncHandler((req: Request, res: Response) => {
  try {
    const authUrl = getGoogleAuthUrl();
    return res.redirect(authUrl);
  } catch (error) {
    return formatResponse(res, 500, "Failed to generate Google auth URL", false, "Error ");
  }
})

export const oauthCallback = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    const { code } = req.query;
    const { idToken } = await getTokens(code as string);
    const { data } = await getOAuthUser(idToken);
    
    const { email, name, picture } = data.getPayload() || {};

    let exitUser = await User.findOne({ email });

    if (exitUser && exitUser.provider !== Provider.GOOGLE) {
      return formatResponse(res, 400, "User already exists with different provider", false);
    }

    if (!exitUser) {
      const newUser = new User({
        email,
        username: name,
        provider: Provider.GOOGLE,
        profilePicture: picture,
        role : UserRole.USER
      });
      await newUser.save();
      exitUser = newUser;
    }

    //access token and refresh token generation and cookie setting
    return await autoSignInUserService(req, res, exitUser, true);
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('invalid_grant')) {
      return res.redirect("/oauth/login/google")
    }
    return formatResponse(res, 500, "Failed to retrieve user data from Google", false, "Error");
  }
});
