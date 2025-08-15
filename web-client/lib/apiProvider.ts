import { AUTH_CREDENTIALS_URI, generateVideo, generateVideoScript, getVideos, SADTALKER, userProfileRoute } from "@/constants/backend_routes";
import axios from "axios";


//redirect with credentials
export const loginWithCredentials = async ( email: string, password: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signin`, { email, password }, {
      withCredentials : true
    });
    return api.data;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials and try again.");
  }
};

//sign up with credentials
export const signUpWithCredentials = async (email: string, password: string, username: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signup`, { email, password, username },{
      withCredentials : true
    });
    return api.data;
  } catch (error) {
    throw new Error("Sign up failed. Please check your details and try again.");
  }
};

//check user with otp
export const checkUserWithOtp = async (email: string, otp: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/checkuser`, { email, otp },{
      withCredentials : true
    });
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

//video generater
export const videoGen = async ({title, style, voiceGender, voiceLanguage, seconds, language} : {
  title: string,
  style: string,
  voiceGender: string,
  voiceLanguage: string,
  seconds: number,
  language?: string
}) => {
  try {
    const api = await axios.post(`${generateVideo}`,{
      title, style, voiceGender, voiceLanguage, seconds, language
    },{
      withCredentials : true
    })
    return api.data;
  } catch (error) {
    console.log(error)
    throw new Error("video service error");
  }
}


//get videos
export const getUserVideos = async() => {
  try {
    const api = await axios.get(`${getVideos}`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error) {
    throw new Error("Failed to get videos. Please try again.");
  }
}

//sadtakler
// description, character, audioUrl, title, style, language
export const sadTalker = async ({ audioUrl, description, character, title, style, language }: { audioUrl: string; description: string; character: string; title: string; style: string; language: string }) => {
  try {
    const api = await axios.post(`${SADTALKER}`, {
      audioUrl,
      description,
      character,
      title,
      style,
      language
    }, {
      withCredentials: true
    });
    return api.data;
  } catch (error) {
    console.log(error);
    throw new Error("SADTalker service error");
  }
};