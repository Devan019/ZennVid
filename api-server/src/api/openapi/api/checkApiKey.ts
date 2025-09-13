import { Request, Response } from "express";
import { OPENAPI_SECERT } from "../../../env_var";
import { formatResponse } from "../../../utils/formateResponse";
import OpenApi from "../model";
import { decrypt, sha256Hex } from "../../../utils/cyrpto";
import { User } from "../../../auth/model/User";

export const checkApiKey = async (req: Request, res: Response, next: Function) => {
  try {
    
    const apiHeader = req.headers["authorization"]?.split(" ");
    const apiKey = apiHeader && apiHeader[0] === "Bearer" ? apiHeader[1] : null;
    const appName = req.headers["x-app-name"];

    if (!OPENAPI_SECERT) {
      return formatResponse(res, 500, "server problem", false);
    }

    if (!apiKey || !appName) {
      return formatResponse(res, 401, "Missing appName or apiKey", false);
    }

    const isExits = await OpenApi.findOne({ "apps.appName": appName });
    if (!isExits) {
      return formatResponse(res, 401, "Appname is invalid", false);
    }

    const hasedPassword = await sha256Hex(apiKey);
    const exitsApp = isExits.apps.find(app => app.apiKeyHash === hasedPassword);

    if (!exitsApp) {
      return formatResponse(res, 401, "AppKey is invalid", false);
    }

    const descrypedPasword = await decrypt(
      {
        iv: exitsApp?.apiKeyEncrypted?.iv ?? "",
        cipher: exitsApp?.apiKeyEncrypted?.cipher ?? ""
      },
      OPENAPI_SECERT
    );

    if (descrypedPasword !== apiKey) {
      return formatResponse(res, 401, "ApiKey is invalid", false);
    }
    const user = await User.findById(isExits.user);
    if (!user) {
      return formatResponse(res, 401, "User not found", false);
    }
    req.user = user;
    return next();
    
  } catch (err) {
    console.error("Error in checkApiKey middleware:", err);
    return formatResponse(res, 500, "Server error", false, err);
  }
};
