import { getUserFromSession, logout } from "./controller"
import { isAuthenticated } from "../middleware"
import { Router } from "express";


export const AuthRouter = Router()

AuthRouter.get("/user", isAuthenticated , getUserFromSession);

AuthRouter.get("/logout", logout)