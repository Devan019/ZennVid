import { AUTH_CREDENTIALS_URI } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios_api from "@/lib/axiosHelper";


//redirect with credentials
export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const api = await axios_api.post(`${AUTH_CREDENTIALS_URI}/signin`, { email, password }, {
      withCredentials: true
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
};

//sign up with credentials
export const signUpWithCredentials = async (email: string, password: string, username: string) => {
  try {
    const api = await axios_api.post(`${AUTH_CREDENTIALS_URI}/signup`, { email, password, username }, {
      withCredentials: true
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
};

//check user with otp
export const checkUserWithOtp = async (email: string, otp: string) => {
  try {
    const api = await axios_api.post(`${AUTH_CREDENTIALS_URI}/checkuser`, { email, otp }, {
      withCredentials: true
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}
