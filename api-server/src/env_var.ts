import { configDotenv } from "dotenv";
configDotenv();

//defined node env 
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

//ip and port of server
const IP_ADDRESS = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT ?? "8000");

//mongodb uri
const MONGO_URI = process.env.MINGODB_PROD || "mongodb://localhost:27017/zennvid";


//domain
const DOMAIN = process.env.DOMAIN || "localhost";

//auth secret for hash the password
const AUTH_SECRET = process.env.AUTH_SECRET

//google auth
const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID
const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET
const AUTH_GOOGLE_REDIRECT_URI = process.env.AUTH_GOOGLE_REDIRECT_URI


//resend key
const RESEND_KEY = process.env.RESEND_KEY

//frontend url
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


//cloudinary
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

//encryption secret for openapi 
const OPENAPI_SECERT=process.env.ENCRYPTION_SECRET;

//nodemailer for email
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;


//groq api key
const GROQ_API_KEY = process.env.GROQ_API_KEY;


//hugging face token
const HF_TOKEN = process.env.HF_TOKEN;
const HF_TOKEN2 = process.env.HF_TOKEN2;
const HF_TOKEN3 = process.env.HF_TOKEN3;
const HF_TOKEN4 = process.env.HF_TOKEN4;
const HF_TOKEN5 = process.env.HF_TOKEN5;
const HF_TOKEN6 = process.env.HF_TOKEN6;
const HF_TOKEN7 = process.env.HF_TOKEN7;
const HF_TOKEN8 = process.env.HF_TOKEN8;
const HF_TOKEN9 = process.env.HF_TOKEN9;
const HF_TOKEN10 = process.env.HF_TOKEN10;

//nebius api
const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;
const NEBIUS_API_URL = process.env.NEBIUS_API_URL;

//hugging face repo for voice clone, lip sync, translate, edge tts, image pipeline and image gen
const VOICE_CLONE_REPO = process.env.VOICE_CLONE_REPO;
const VOICE_CLONE_REPO_API = process.env.VOICE_CLONE_REPO_API;

const LIP_SYNC_REPO = process.env.LIP_SYNC_REPO;
const LIP_SYNC_REPO_API = process.env.LIP_SYNC_REPO_API;

const DURATION = process.env.LIP_SYNC_AUDIO_API;

const TRANSLATE_REPO = process.env.TRANSLATE_REPO;
const TRANSLATE_REPO_API = process.env.TRANSLATE_REPO_API;

const EDGE_TTS_REPO = process.env.EDGE_TTS_REPO;
const EDGE_TTS_REPO_API = process.env.EDGE_TTS_REPO_API;

const IMAGE_PIPELINE_REPO = process.env.IMAGE_PIPELINE_REPO;
const IMAGE_PIPELINE_REPO_API = process.env.IMAGE_PIPELINE_REPO_API;

const HF_IMAGE_GEN_REPO = process.env.IMAGE_GEN_REPO;
const HF_IMAGE_GEN_REPO_API = process.env.IMAGE_GEN_REPO_API;


//worker of cloudflare
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL;
const CLOUDFLARE_WORKER_KEY = process.env.CLOUDFLARE_WORKER_KEY;

//pinecone
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

//redis url
const REDIS_URL = process.env.REDIS_URL;

//keys
const ACCESS_KEY = process.env.ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


//times
const accessPeroid = 2 * 30 * 1000; // 2 min
const refreshPeroid = 7 * 24 * 60 * 60 * 1000; // 7 days

const accessPeroidJwt = "2m"; // 2 minutes
const refreshPeroidJwt = "7d"; // 7 days

//bull-mq
const queueName = "video-generation";
const syncStudioJobName = "sync-studio-video-gen";
const magicVideoJobName = "magic-video-gen";

//job time and key
const active_job_zset = "active_job_zset";
const active_job_data = "active_job_data"
const active_job_time = 24 * 60 * 60 ; //24 hr

//export all
export {
  NODE_ENV,
  IS_PROD,
  IP_ADDRESS,
  PORT,
  MONGO_URI,
  DOMAIN,
  AUTH_SECRET,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_GOOGLE_REDIRECT_URI,
  RESEND_KEY,
  FRONTEND_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  OPENAPI_SECERT,
  SMTP_USER,
  SMTP_PASS,
  GROQ_API_KEY,
  HF_TOKEN,
  HF_TOKEN2,
  HF_TOKEN3,
  HF_TOKEN4,
  HF_TOKEN5,
  HF_TOKEN6,
  HF_TOKEN7,
  HF_TOKEN8,
  HF_TOKEN9,
  HF_TOKEN10,
  NEBIUS_API_KEY,
  NEBIUS_API_URL,
  VOICE_CLONE_REPO,
  VOICE_CLONE_REPO_API,
  LIP_SYNC_REPO,
  LIP_SYNC_REPO_API,
  DURATION,
  TRANSLATE_REPO,
  TRANSLATE_REPO_API,
  EDGE_TTS_REPO,  
  EDGE_TTS_REPO_API,
  IMAGE_PIPELINE_REPO,
  IMAGE_PIPELINE_REPO_API,
  HF_IMAGE_GEN_REPO,
  HF_IMAGE_GEN_REPO_API,
  PINECONE_API_KEY,
  PINECONE_INDEX_NAME,
  REDIS_URL,
  ACCESS_KEY,
  REFRESH_KEY,
  REFRESH_SECRET,
  accessPeroid,
  refreshPeroid,
  accessPeroidJwt,
  refreshPeroidJwt,
  queueName,
  syncStudioJobName,
  magicVideoJobName,
  active_job_time,
  active_job_data,
  active_job_zset,
  CLOUDFLARE_WORKER_KEY,
  CLOUDFLARE_WORKER_URL,
}

