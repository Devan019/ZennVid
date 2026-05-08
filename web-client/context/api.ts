import {logoutRoute, refreshTokenRoute, userProfileRoute } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios_api from "@/lib/axiosHelper";
import axios from "axios";


//logout user
export const logoutUser = async () => {
  try {
    const api = await axios_api.get(`${logoutRoute}`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
};

//get user
export const getUser = async () => {
  try {
    const api = await axios_api.get(`${userProfileRoute}`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    if (err.code === "ERR_NETWORK") return {
      MESSAGE: "Server seems to be down.Try again later.",
      SUCCESS: false,
    }
    return err.response?.data;
  }
};

//reset user
export const resetUserApi = async () => {
  try {
    const API = await axios.post(`${refreshTokenRoute}`, {}, {withCredentials: true});
    return API.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}
