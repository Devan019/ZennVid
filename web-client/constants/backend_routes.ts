
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

export const TX_STATS = `${api}/admin/stats/transactionstats`

export const TX_CHARTCHANGE = `${api}/admin/stats/change-daily-revenue`

export const TX_HISTORY = `${api}/admin/stats/transcation-history`

export const USER_STATS = `${api}/admin/stats/userstats`

export const DEVELOPER_STATS = `${api}/admin/stats/developerstats`

export const VIDEO_STATS = `${api}/admin/stats/videostats`

export const ADMIN_USER = `${api}/admin/users`

export const DAILY_DEVELOPER = `${api}/admin/stats/change-daily-developer`

export const DAILY_USER = `${api}/admin/stats/change-daily-user`

export const DAILY_VIDEO = `${api}/admin/stats/change-daily-video`

export const CSV_USERS = `${api}/admin/users/csv`

export const TRANSACTION_CSV = `${api}/admin/stats/transaction-csv`

export const FEED = `${api}/feed`

export const ANIME_MATCHING = `${api}/anime/anime-matching`
