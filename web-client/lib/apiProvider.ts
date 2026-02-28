import { ADMIN_USER, ANIME_MATCHING, AUTH_CREDENTIALS_URI, CREATEAPP, CSV_USERS, DAILY_DEVELOPER, DAILY_USER, DAILY_VIDEO, DEVELOPER_STATS, FEED, generateVideo, GETAPPS, getVideos, OPENAPI_STATS, SEND_KEY_URI, SYNCSTUDIO_API, TRANSACTION_CSV, TX_CHARTCHANGE, TX_HISTORY, TX_STATS, UPDATE_CREDITS, USER_STATS, userProfileRoute, VIDEO_STATS } from "@/constants/backend_routes";
import axios from "axios";

interface Error{
  code ?: string;
  response?:{
    data: object
  }
}


//redirect with credentials
export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signin`, { email, password }, {
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
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/signup`, { email, password, username }, {
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
    const api = await axios.post(`${AUTH_CREDENTIALS_URI}/checkuser`, { email, otp }, {
      withCredentials: true
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
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
      MESSAGE: "Too many requests, please try again after a minute",
      SUCCESS: false,
    }
    return err.response?.data;
  }
};

//video generater
export const magicVideo = async ({ title, style, voiceGender, voiceLanguage, seconds, language }: {
  title: string,
  style: string,
  voiceGender: string,
  voiceLanguage: string,
  seconds: number,
  language?: string
}) => {
  try {
    const api = await axios.post(`${generateVideo}`, {
      title, style, voiceGender, voiceLanguage, seconds, language
    }, {
      withCredentials: true
    })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


//get videos
export const getUserVideos = async () => {
  try {
    const api = await axios.get(`${getVideos}`, {
      withCredentials: true,
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

//sadtakler
export const syncStudio = async ({ formData }: { formData: FormData }) => {
  try {
    const api = await axios.post(`${SYNCSTUDIO_API}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
};

/**delete a video */
export const deleteVideo = async ({ id }: { id: string }) => {
  try {
    const api = await axios.delete(`${getVideos}/${id}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/**make app */
export const createNewApp = async (name: string) => {
  try {
    const api = await axios.post(CREATEAPP, { name }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/**get apis */
export const getApps = async () => {
  try {
    const api = await axios.get(GETAPPS, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/**send key to email */
export const sendKey = async ({ appId }: { appId: string }) => {
  try {
    const api = await axios.post(`${SEND_KEY_URI}`, { appId }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** get stats */

export const Stats = async () => {
  try {
    const api = await axios.get(`${OPENAPI_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** credits update */
export const updateCredits = async ({ credits, paymentId, amount }: {
  credits: number,
  paymentId: string,
  amount: number
}) => {
  try {
    const api = await axios.post(`${UPDATE_CREDITS}`, { credits, paymentId, amount }, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** Transcation Stats  */
export const txStats = async () => {
  try {
    const api = await axios.get(`${TX_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** User stats */
export const userStats = async () => {
  try {
    const api = await axios.get(`${USER_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** Developer stats */
export const developerstats = async () => {
  try {
    const api = await axios.get(`${DEVELOPER_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** Video Stats */
export const videostats = async () => {
  try {
    const api = await axios.get(`${VIDEO_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** user get */
export const getAllUser = async (
  {
    page,
    limit,
    search,
    createdAt
  }: {
    page: number,
    limit: number,
    search?: string,
    createdAt?: Date
  }
) => {
  try {
    const api = await axios.post(`${ADMIN_USER}/all`, {
      page, limit, search, createdAt
    }, { withCredentials: true })
    return api.data
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** user delete */
export const deleteUser = async ({ id }: { id: string }) => {
  try {
    const api = await axios.delete(`${ADMIN_USER}/${id}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** user update */
export const updateUser = async (
  { userId, username, credits }: {
    userId: string,
    username: string,
    credits: number
  }
) => {
  try {
    const api = await axios.put(`${ADMIN_USER}/${userId}`, { username, credits }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** create user */
export const createUser = async (
  { email, password, username, provider }: {
    email: string,
    password: string,
    username: string,
    provider: string
  }
) => {
  try {
    const api = await axios.post(`${ADMIN_USER}`, { email, password, username, provider }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** get transaction history */
export const getTransactionHistory = async (
  { page, limit, search, createdAt }: {
    page: number,
    limit: number,
    search?: string,
    createdAt?: Date
  }
) => {
  try {
    const api = await axios.post(`${TX_HISTORY}`, { page, limit, search, createdAt }, { withCredentials: true });
    return api.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**  change-daily-revenue  */
export const changeDailyRevenue = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${TX_CHARTCHANGE}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** change daily developer */
export const changeDailyDeveloper = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${DAILY_DEVELOPER}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** change daily user */
export const changeDailyUser = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${DAILY_USER}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** change daily video */
export const changeDailyVideo = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${DAILY_VIDEO}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** get csv data */
export const getCSVUsers = async () => {
  try {
    const api = await axios.get(`${CSV_USERS}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** create feed post */
export const feedCreate = async ({ userId, videoId }: { userId: string, videoId: string }) => {
  try {
    const api = await axios.post(`${FEED}`, { userId, videoId }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** get feed posts */
export const getFeedPosts = async () => {
  try {
    const api = await axios.get(`${FEED}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/* delete feed post */
export const deleteFeedPost = async ({ feedId }: { feedId: string }) => {
  try {
    const api = await axios.delete(`${FEED}/${feedId}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** like count update */
export const feedLikeCountUpdate = async ({ feedId, userId }: { feedId: string, userId: string }) => {
  try {
    const api = await axios.put(`${FEED}/${feedId}/like`, { feedId, userId }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}
/** feed comment */
export const feedComment = async ({ feedId, userId, content }: { feedId: string, userId: string, content: string }) => {
  try {
    const api = await axios.post(`${FEED}/${feedId}/comment`, { userId, content }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** feed comment delete */
export const feedCommentDelete = async ({ commentId }: { commentId: string }) => {
  try {
    const api = await axios.delete(`${FEED}/comment/${commentId}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** get transaction csv */
export const getTransactionCSV = async () => {
  try {
    const api = await axios.get(`${TRANSACTION_CSV}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/**anime matching */
export const animeMatching = async ({ formData }: { formData: FormData }) => {
  try {
    const api = await axios.post(`${ANIME_MATCHING}`, formData, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}