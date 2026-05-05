import { ADMIN_USER, ANIME_MATCHING, FEED, generateVideo, getVideos, OPENAPI_STATS, UPDATE_CREDITS } from "@/constants/backend_routes";
import axios from "axios";
import { getCloudinaryUrl } from "./getPublicUrl";

export interface Error {
  code?: string;
  response?: {
    data: object
  }
}

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
    const data = api.data;
    if (!data?.DATA || !Array.isArray(data.DATA)) {
      return data;
    }

    return {
      ...data,
      DATA: data.DATA.map((video: any) => ({
        ...video,
        videoUrl: getCloudinaryUrl(video.videoMetadata),
      })),
    };
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}



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
    const data = api.data;
    if (!data?.DATA || !Array.isArray(data.DATA)) {
      return data;
    }

    return {
      ...data,
      DATA: data.DATA.map((feed: any) => ({
        ...feed,
        video: {
          ...feed.video,
          videoUrl: feed?.video?.videoUrl || getCloudinaryUrl(feed?.video?.videoMetadata),
        },
      })),
    };
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