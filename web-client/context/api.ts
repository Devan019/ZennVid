
//user-context apis

import { AUTH_CREDENTIALS_URI, userProfileRoute } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios from "axios";


//logout user
export const logoutUser = async () => {
  try {
    const api = await axios.get(`${AUTH_CREDENTIALS_URI}/logout`, {
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
    const api = await axios.get(`${userProfileRoute}`, {
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
