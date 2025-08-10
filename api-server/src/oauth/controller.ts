import { Request, Response } from "express";
import expressAsyncHandler from "../utils/expressAsync";
import { getGoogleAuthUrl, getOAuthUser, getTokens } from "./service";
import { formatResponse } from "../utils/formateResponse";
import { AUTH_SECRET, FRONTEND_URL } from "../env_var";
import { generateJWTtoken } from "../utils/jwtAssign";
import { User } from "../auth/model/User";
import { Provider } from "../constants/provider";
import connectToMongo from "../utils/mongoConnection";
import { SetCookie } from "../utils/setCookie";

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

    if(req.cookies.token) {
      return res.redirect("/auth/user");
    }

    const { code } = req.query;
    const { idToken } = await getTokens(code as string);
    const { data } = await getOAuthUser(idToken);
    await connectToMongo();
    const { email, name, picture } = data.getPayload() || {};
    
    let exitUser = await User.findOne({ email});
    if(exitUser && exitUser.provider !== Provider.GOOGLE) {
      return formatResponse(res, 400, "User already exists with different provider", false);
    }
    if(!exitUser){
      const newUser = new User({
        email,
        username: name,
        provider: Provider.GOOGLE,
        profilePicture: picture,
      });
      await newUser.save();
      exitUser = newUser;
    }
    const jwtToken = generateJWTtoken({
      id: exitUser._id.toString(),
      email: email || exitUser.email,
      provider: Provider.GOOGLE,
      username: exitUser.username,
    });
    SetCookie(res, "token", jwtToken, 60 * 60 * 24 * 7); // 7 days
    return res.redirect(`${FRONTEND_URL}`);
  } catch (error: any) {
    console.log(error)
    if (error instanceof Error && error.message.includes('invalid_grant')) {
      return res.redirect("/oauth/login/google")
    }
    return formatResponse(res, 500, "Failed to retrieve user data from Google", false, "Error");
  }
});

// "payload": {
//       "iss": "https://accounts.google.com",
//       "azp": "349832524304-sj0k60nu0jd67peeujhbr6jmk9fm55gv.apps.googleusercontent.com",
//       "aud": "349832524304-sj0k60nu0jd67peeujhbr6jmk9fm55gv.apps.googleusercontent.com",
//       "sub": "103451832644510589179",
//       "hd": "ddu.ac.in",
//       "email": "23ceubs023@ddu.ac.in",
//       "email_verified": true,
//       "at_hash": "q51tqI1CknadtSDKWq-rRA",
//       "name": "A4_CE068_Devan Chauhan",
//       "picture": "https://lh3.googleusercontent.com/a/ACg8ocJYkUUAbAkMWHtD_2V8uA3i1mGD3UnlljuFfzbLWYsdwYQwqA=s96-c",
//       "given_name": "A4_CE068_Devan Chauhan",
//       "iat": 1753954615,
//       "exp": 1753958215
//     }