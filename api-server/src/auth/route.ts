// import { createUser, getUserFromSession, logout } from "./controller"
import { isAuthenticated } from "../middleware"
import { Router } from "express";
import { checkUser, CreateAdmin, createUser, getUserFromSession, logout, signInUser } from "./controller";
import { Auth } from "googleapis";


export const AuthRouter = Router()

AuthRouter.get("/user", isAuthenticated , getUserFromSession);

AuthRouter.post("/signup", createUser);

AuthRouter.get("/logout", logout);

AuthRouter.post("/signin", signInUser);

AuthRouter.post("/checkuser", checkUser);

AuthRouter.post("/createadmin", CreateAdmin);

