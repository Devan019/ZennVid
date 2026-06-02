import { CREATE_ORDER, FEED, generateVideo, getVideos } from "@/constants/backend_routes";
import axios_api from "./axiosHelper";

export interface Error {
  code?: string;
  response?: {
    data: object
  }
}

//video generater
export const magicVideo = async ({ title, style, voiceGender, voiceLanguage, language }: {
  title: string,
  style: string,
  voiceGender: string,
  voiceLanguage: string,
  language?: string
}) => {
  try {
    const api = await axios_api.post(`${generateVideo}`, {
      title, style, voiceGender, voiceLanguage, language
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
    const api = await axios_api.get(`${getVideos}`, {
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
    const api = await axios_api.delete(`${getVideos}/${id}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** create feed post */
export const feedCreate = async ({ userId, videoId }: { userId: string, videoId: string }) => {
  try {
    const api = await axios_api.post(`${FEED}`, { userId, videoId }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** get feed posts */
export const getFeedPosts = async () => {
  try {
    const api = await axios_api.get(`${FEED}`, { withCredentials: true });
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
          videoUrl: feed?.video?.videoUrl
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
    const api = await axios_api.delete(`${FEED}/${feedId}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** like count update */
export const feedLikeCountUpdate = async ({ feedId, userId }: { feedId: string, userId: string }) => {
  try {
    const api = await axios_api.put(`${FEED}/${feedId}/like`, { feedId, userId }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}
/** feed comment */
export const feedComment = async ({ feedId, userId, content }: { feedId: string, userId: string, content: string }) => {
  try {
    const api = await axios_api.post(`${FEED}/${feedId}/comment`, { userId, content }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** feed comment delete */
export const feedCommentDelete = async ({ commentId }: { commentId: string }) => {
  try {
    const api = await axios_api.delete(`${FEED}/comment/${commentId}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** create order */
export const createOrder = async ({planId}: {planId: string}) => {
  try {
    const api = await axios_api.post(`${CREATE_ORDER}`, { planId }, { withCredentials: true })
    return api.data;

  }catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}