import { createUser, getUserFromSession, login, logout } from "./controller"
import { isAuthenticated } from "../middleware"
import { Router } from "express";


export const AuthRouter = Router()

AuthRouter.get("/user", isAuthenticated , getUserFromSession);

AuthRouter.post("/signup", createUser);

AuthRouter.post("/login", login);

AuthRouter.get("/logout", logout);