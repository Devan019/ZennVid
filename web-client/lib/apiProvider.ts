import { AUTH_CREDENTIALS_URI, AUTH_GOOGLE_URI } from "@/constants/backend_routes";
import axios from "axios";


//redirect with auth provider
export const loginWithGoogle = async () => {
  const api = await axios.get(`${AUTH_GOOGLE_URI}`);
  return api.data;
};

//redirect with credentials
export const loginWithCredentials = async ( email: string, password: string) => {
  try {
    console.log("Logging in with credentials:", { email, password });
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signin`, { email, password });
    return api.data;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials and try again.");
  }
};

//sign up with credentials
export const signUpWithCredentials = async (email: string, password: string, username: string) => {
  try {
    console.log("Signing up with credentials:", { email, password, username });
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signup`, { email, password, username });
    return api.data;
  } catch (error) {
    throw new Error("Sign up failed. Please check your details and try again.");
  }
};

//check user with otp
export const checkUserWithOtp = async (email: string, otp: string) => {
  try {
    console.log("Checking user with OTP:", { email, otp });
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/checkuser`, { email, otp });
    return api.data;
  } catch (error) {
    throw new Error("OTP verification failed. Please check your OTP and try again.");
  }
}