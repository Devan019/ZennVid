import { Router } from "express";
import { loginWithGoogle, oauthCallback } from "./controller";

export const OAuthRouter = Router();

OAuthRouter.get("/login/google", loginWithGoogle);

OAuthRouter.get("/callback/google", oauthCallback)