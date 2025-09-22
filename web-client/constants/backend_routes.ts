
const auth = process.env.NEXT_PUBLIC_AUTH_URL;
const oauth = process.env.NEXT_PUBLIC_OAUTH_URI;
const api = process.env.NEXT_PUBLIC_API_URL;

if (!auth) {
  throw new Error("AUTH URL not set");
}

if (!oauth) {
  throw new Error("OAUTH URL not set");
}

if (!api) {
  throw new Error("API URL not set")
}

export const AUTH_CREDENTIALS_URI = `${auth}`;
export const userProfileRoute = `${auth}/user`;

export const UPDATE_CREDITS = `${api}/update-credit`;

export const generateVideoScript = `${api}/generate-script`
export const generateVideo = `${api}/generate-video`;
export const AUTH_GOOGLE_OAUTH_URI = `${oauth}/login/google`;

export const getVideos = `${api}/videos`

export const SADTALKER = `${api}/sadtalker`

export const CREATEAPP = `${api}/openapi/app`

export const GETAPPS = `${api}/openapi/apps`

export const SEND_KEY_URI = `${api}/openapi/app/sendkey`

export const OPENAPI_STATS = `${api}/openapi/dashboard` 

export const LANGUAGES = `${api}/openapi/languages`

export const TEXT_TRANSLATE = `${api}/openapi/translate`

export const VOICES = `${api}/openapi/voices`

export const GEN_AUDIO = `${api}/openapi/generate-audio`