import { AUTH_CREDENTIALS_URI, generateVideoScript, userProfileRoute } from "@/constants/backend_routes";
import axios from "axios";


//redirect with credentials
export const loginWithCredentials = async ( email: string, password: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signin`, { email, password });
    return api.data;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials and try again.");
  }
};

//sign up with credentials
export const signUpWithCredentials = async (email: string, password: string, username: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signup`, { email, password, username });
    return api.data;
  } catch (error) {
    throw new Error("Sign up failed. Please check your details and try again.");
  }
};

//check user with otp
export const checkUserWithOtp = async (email: string, otp: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/checkuser`, { email, otp });
    return api.data;
  } catch (error) {
    throw new Error("OTP verification failed. Please check your OTP and try again.");
  }
}

//logout user
export const logoutUser = async () => {
  try {
    const api = await axios.get(`${AUTH_CREDENTIALS_URI}/logout`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error) {
    throw new Error("Logout failed. Please try again.");
  }
};

//get user
export const getUser = async () => {
  try {
    const api = await axios.get(`${userProfileRoute}`,{
      withCredentials: true,
    });
    return api.data;
  } catch (error) {
    throw new Error("Failed to get user. Please try again.");
  }
};

//script generater
export const scriptGen = async ({title, style, maxChars} : {
  title : string,
  style: string,
  maxChars : number
}) => {
  try {
    const api = await axios.post(`${generateVideoScript}`,{
      title, style, maxChars
    })    
    return api.data;
  } catch (error) {
    console.log(error)
    throw new Error("script service error");
  }
}

