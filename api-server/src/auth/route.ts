// import { createUser, getUserFromSession, logout } from "./controller"
import { isAuthenticated } from "../middleware"
import { Router } from "express";
import { checkUser, createUser, getUserFromSession, logout, signInUser } from "./controller";


export const AuthRouter = Router()

AuthRouter.get("/user", isAuthenticated , getUserFromSession);

AuthRouter.post("/signup", createUser);

AuthRouter.get("/logout", logout);

AuthRouter.post("/signin", signInUser);

AuthRouter.post("/checkuser", checkUser);


