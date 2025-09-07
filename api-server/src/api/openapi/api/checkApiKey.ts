import { Request, Response } from "express";
import { OPENAPI_SECERT } from "../../../env_var";
import { formatResponse } from "../../../utils/formateResponse";
import OpenApi from "../model";
import connectToMongo from "../../../utils/mongoConnection";
import { decrypt, sha256Hex } from "../../../utils/cyrpto";

export const checkApiKey = async(req:Request, res:Response) => {
  await connectToMongo();
  const apiKey = req.headers["authorization"]?.split(" ")[1];
  const appName = req.headers["x-app-name"];

  const secret = OPENAPI_SECERT;

  if (!secret) {
    return formatResponse(res, 500, "server problem", false)
  }

  if (!apiKey || !appName) {
    return formatResponse(res, 401, "Missing appName or apiKey", false);
  }
  const isExits = await OpenApi.find({
    "apps.name": appName,
  });

  if (!isExits) {
    return formatResponse(res, 401, "Appname is invalid", false);
  }
  const hasedPassword = await sha256Hex(apiKey);

  let exitsApp: any;
  isExits.forEach((obj) => {
    obj.apps.forEach((app) => {
      if (app.apiKeyHash === hasedPassword) {
        exitsApp = app;
      }
    })
  })

  if (exitsApp) {
    return formatResponse(res, 401, "AppKey is invalid", false);
  }

  const descrypedPasword = await decrypt({
    iv: exitsApp?.apiKeyEncrypted?.iv ?? "",
    cipher: exitsApp?.apiKeyEncrypted?.cipher ?? ""
  }, OPENAPI_SECERT ?? "")

  if (descrypedPasword != apiKey) {
    return formatResponse(res, 401, "Appname is invalid", false);
  }

  return {
    status: true,
    app : exitsApp
  }
}