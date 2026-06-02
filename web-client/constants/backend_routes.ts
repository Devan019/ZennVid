const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if(!baseUrl) {
  throw new Error("BASE URL not set")
}

const auth = baseUrl + "/auth";
const oauth = baseUrl + "/oauth";
const api = baseUrl + "/api";
const job = baseUrl + "/jobstatus";

export const BASE_URL = baseUrl;

export const paymentStream = `${baseUrl}/payments/stream`

export const AUTH_CREDENTIALS_URI = `${auth}`;
export const userProfileRoute = `${auth}/user`;
export const refreshTokenRoute = `${auth}/refresh`;
export const logoutRoute = `${auth}/logout`;

export const CREATE_ORDER = `${api}/create-order`

export const generateVideoScript = `${api}/generate-script`
export const generateVideo = `${api}/magic-video`;
export const AUTH_GOOGLE_OAUTH_URI = `${oauth}/login/google`;

export const getVideos = `${api}/videos`

export const SYNCSTUDIO_API = `${api}/syncstudio-video`

export const FEED = `${api}/feed`

export const ANIME_MATCHING = `${api}/anime/anime-matching`

//job status route
export const jobStatus = `${job}`