import { AUTH_CREDENTIALS_URI, CREATEAPP, generateVideo, generateVideoScript, GETAPPS, getVideos, OPENAPI_STATS, SADTALKER, SEND_KEY_URI, UPDATE_CREDITS, userProfileRoute } from "@/constants/backend_routes";
import axios from "axios";


//redirect with credentials
export const loginWithCredentials = async ( email: string, password: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signin`, { email, password }, {
      withCredentials : true
    });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
};

//sign up with credentials
export const signUpWithCredentials = async (email: string, password: string, username: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signup`, { email, password, username },{
      withCredentials : true
    });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
};

//check user with otp
export const checkUserWithOtp = async (email: string, otp: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/checkuser`, { email, otp },{
      withCredentials : true
    });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
}

//logout user
export const logoutUser = async () => {
  try {
    const api = await axios.get(`${AUTH_CREDENTIALS_URI}/logout`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
};

//get user
export const getUser = async () => {
  try {
    const api = await axios.get(`${userProfileRoute}`,{
      withCredentials: true,
    });
    return api.data;
  } catch (error: any) {
    if(error.code === "ERR_NETWORK") return {
      MESSAGE : "Too many requests, please try again after a minute",
      SUCCESS : false,
    }
    return error.response.data;
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
  } catch (error: any) {
    return error.response.data;
  }
}


//get videos
export const getUserVideos = async() => {
  try {
    const api = await axios.get(`${getVideos}`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
}

//sadtakler
// description, character, title, style, language
export const sadTalker = async ({ description, character, title, style, language }: { description: string; character: string; title: string; style: string; language: string }) => {
  try {
    const api = await axios.post(`${SADTALKER}`, {
      description,
      character,
      title,
      style,
      language
    }, {
      withCredentials: true
    });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
};

/**delete a video */
export const deleteVideo = async({id} : {id:string}) => {
  try {
    const api = await axios.delete(`${getVideos}?videoId:${id}`,{withCredentials: true});
    return api.data;
  } catch (error:any) {
    return error.response.data;
  }
}

/**make app */
export const createNewApp = async (name: string) => {
  try {
    const api = await axios.post(CREATEAPP, {name},{withCredentials:true});
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
}

/**get apis */
export const getApps = async() => {
  try {
    const api = await axios.get(GETAPPS,{withCredentials:true});
    return api.data;
  }catch (error: any) {
    return error.response.data;
  }
}

/**send key to email */
export const sendKey = async({ appId }: { appId: string }) => {
  try {
    const api = await axios.post(`${SEND_KEY_URI}`, { appId }, { withCredentials: true });
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
}

/** get stats */

export const Stats = async() => {
  try {
    const api = await axios.get(`${OPENAPI_STATS}`, {withCredentials: true})
    return api.data;
  } catch (error: any) {
    return error.response.data;
  }
}

/** credits update */
export const updateCredits = async(credits: number) => {
  try {
    const api = await axios.post(`${UPDATE_CREDITS}`, {credits}, {withCredentials: true})
    return api.data;
  } catch (error:any) {
    return error.response.data;
  }
}