import { NextFunction, Request, Response } from "express";
import { formatResponse } from "./utils/formateResponse";
import expressAsyncHandler from "./utils/expressAsync";
import jwt from "jsonwebtoken";
import { ACCESS_KEY, REFRESH_KEY } from "./env_var";
import { RefreshToken } from "./auth/model/RefreshToken";
import { sha256Hex } from "./utils/cyrpto";
import { User } from "./auth/model/User";
import { SetCookie } from "./utils/setCookie";
import { UserRole } from "./constants/provider";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        provider: string;
        username: string;
        credits : number;
        profilePicture : string;
        role : UserRole;
      }
    }
  }
}

let i = 0;

export const isAuthenticated = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req.cookies;

  // 1. Try to verify the Access Token first
  if (access_token) {
    try {
      const decoded = jwt.verify(access_token, ACCESS_KEY ?? "");
      req.user = decoded as any;
      return next(); // donee.
    } catch (error) {
      // Access token is expired/invalid. Let it fall through to the refresh logic.
    }
  }

  // 2. If we reach here, Access Token is missing or dead. Try Refresh Token.
  if (!refresh_token) {
    // We MUST return here so we don't accidentally call next() later
    return formatResponse(res, 401, "Unauthorized", false, null);
  }

  try {
    
    // 3. Verify Refresh Token math
    const decodedRefresh = jwt.verify(refresh_token, REFRESH_KEY ?? "") as any;
    const { id } = decodedRefresh;

    if (!id) return formatResponse(res, 401, "Unauthorized", false, null);

    // 4. Check DB (Note: Make sure your schema uses 'user' depending on what you named it earlier!)
    const tokenRecord = await RefreshToken.findOne({ user: id });
    console.log("Token Record from DB:", tokenRecord, "from request with id:",id, " and i is", i++);

    if (!tokenRecord) {
      return formatResponse(res, 401, "Unauthorized", false, null);
    }

    // 5. Hash & Compare
    const hashedIncoming = await sha256Hex(refresh_token);
    if (tokenRecord.token !== hashedIncoming) {
      return formatResponse(res, 401, "Unauthorized", false, null);
    }


    // 6. user details
    const userDetails = await User.findById(id).select("-password").lean();
    const userDoc = Array.isArray(userDetails) ? userDetails[0] : userDetails;

    if (!userDoc) {
      return formatResponse(res, 404, "User not found", false, null);
    }

    // 7. Create the clean payload (matching your TS Interface)
    const payload = {
      id: String(userDoc._id),
      email: userDoc.email,
      provider: userDoc.provider,
      username: userDoc.username,
      credits: userDoc.credits,
      role: userDoc.role,
      profilePicture: userDoc.profilePicture
    };

    // 8. Generate NEW Access Token
    const newAccessToken = jwt.sign(payload, ACCESS_KEY ?? "", { expiresIn: "1m" });
    SetCookie(res, "access_token", newAccessToken, 1*60*1000);

    //set cookie
    req.cookies.access_token = newAccessToken;

    // 9. Attach to request
    req.user = payload;
    
    // done
    return next();

  } catch (refreshError) {
    // Catch if the refresh token itself is expired or tampered with
    return formatResponse(res, 401, "Session expired. Please log in again.", false, null);
  }
});