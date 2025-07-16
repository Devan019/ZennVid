import { AUTH_CREDENTIALS_URI, AUTH_GOOGLE_URI } from "@/constants/backend_routes";
import axios from "axios";


//redirect with auth provider
export const loginWithGoogle = async () => {
  const api = await axios.get(`${AUTH_GOOGLE_URI}`);
  return api.data;
};

//redirect with credentials
export const loginWithCredentials = async (username: string, email: string, password: string) => {
  try {
    console.log("Logging in with credentials:", { username, email, password });
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}`, { username, email, password });
    return api.data;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials and try again.");
  }
};