import { NextFunction, Request, Response } from "express";
import { SignInValidation, UserValidation } from "./schema/zodschema";
import connectToMongo from "../utils/mongoConnection";
import { User } from "./model/User";
import { formatResponse } from "../utils/formateResponse";
import expressAsyncHandler from "../types/expressAsync";
import { Provider } from "../constants/provider";
import axios from "axios";
export const getUserFromSession = expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals.session;
  return formatResponse(res, 200, "User retrieved successfully", true, user);
});

export const logout = expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.session = { user: null };
    res.clearCookie("authjs.session-token");
    return formatResponse(res, 200, "Sign out successful", true);
  } catch (error) {
    return formatResponse(res, 500, "Sign out failed", false);
  }
})

export const createUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    console.log("Request body:", body);
    const data = UserValidation.parse(body);
    const { username, email, password } = data;
    if (!username || !email || !password) {
      return formatResponse(res, 400, "Username, email, and password are required", false);
    }

    await connectToMongo();
    const isExitUser = await User.findOne({
      $or: [
        { email }, { username }
      ]
    })

    if (isExitUser) {
      return formatResponse(res, 409, "User already exists", false);
    }

    const newUser = new User({
      username,
      email,
      password,
      provider: Provider.CREDENTIALS
    });


    await newUser.save();

    return formatResponse(res, 201, "User created successfully", true, { newUser });
  } catch (error) {
    console.error(error);
    return formatResponse(res, 500, "User creation failed", false, error instanceof Error ? error.message : "Unknown error");
  }
});

export const login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const {provider} = SignInValidation.parse(body);
    const api = await axios.post(`http://localhost:3000/auth/signin`, { body });
    const data = api.data;
    // console.log("API response:", data);
    return formatResponse(res, 200, "Login successful", true, data);
  } catch (error) {
    console.error(error);
    return formatResponse(res, 500, "Login failed", false, error instanceof Error ? error.message : "Unknown error");
  }
})