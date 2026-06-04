import { configDotenv } from "dotenv";
configDotenv();

//defined node env 
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

//ip and port of server
const IP_ADDRESS = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT ?? "8000");

//mongodb uri
const MONGO_URI = process.env.MONGODB_PROD || "mongodb://localhost:27017/zennvid";


//domain
const DOMAIN = process.env.DOMAIN || "localhost";

//auth secret for hash the password
const AUTH_SECRET = process.env.AUTH_SECRET

//google auth
const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID
const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET
const AUTH_GOOGLE_REDIRECT_URI = process.env.AUTH_GOOGLE_REDIRECT_URI


//frontend url
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


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

//hugging face repo for voice clone, lip sync, translate, edge tts, image pipeline and image gen
const VOICE_CLONE_REPO = process.env.VOICE_CLONE_REPO;
const VOICE_CLONE_REPO_API = process.env.VOICE_CLONE_REPO_API;

const LIP_SYNC_REPO = process.env.LIP_SYNC_REPO;
const LIP_SYNC_REPO_API = process.env.LIP_SYNC_REPO_API;

const DURATION = process.env.LIP_SYNC_AUDIO_API;

const EDGE_TTS_REPO = process.env.EDGE_TTS_REPO;
const EDGE_TTS_REPO_API = process.env.EDGE_TTS_REPO_API;

//assembly ai api key
const ASSEMBLY_AI_KEY = process.env.ASSEMBLY_AI_KEY;


//worker of cloudflare
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL;
const CLOUDFLARE_WORKER_KEY = process.env.CLOUDFLARE_WORKER_KEY;

const CLOUDFLARE_TXT2IMG = CLOUDFLARE_WORKER_URL + "/txt2img";
const CLOUDFLARE_IMG2IMG = CLOUDFLARE_WORKER_URL + "/img2img";


//redis url
const REDIS_URL = process.env.AVAIN_VALKEY;

//keys
const ACCESS_KEY = process.env.ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


//times
const accessPeroid = 5 * 60 * 1000; // 5 min
const refreshPeroid = 7 * 24 * 60 * 60 * 1000; // 7 days

const accessPeroidJwt = "5m"; // 5 minutes
const refreshPeroidJwt = "7d"; // 7 days

//bull-mq
const queueName = "video-generation";
const syncStudioJobName = "sync-studio-video-gen";
const magicVideoJobName = "magic-video-gen";
const videoUploadJobName = "video-upload";


//job time and key
const active_job_zset = "active_job_zset";
const active_job_data = "active_job_data"
const active_job_time = 24 * 60 * 60; //24 hr

//s3 access key and secret key
const S3_API=process.env.S3_API;
const S3_API_TOKEN = process.env.S3_API_TOKEN;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_PUBLIC_BUCKET = process.env.S3_PUBLIC_BUCKET;
const S3_PRIVATE_BUCKET = process.env.S3_PRIVATE_BUCKET;
const S3_REGION = "auto";
const S3_CDN = process.env.S3_CDN;

//s3 files prefix
const video_prefix = "videos";
const image_prefix = "images";
const audio_prefix = "audios";

const razorpay_webhook_secret = process.env.RAZORPAY_WEBHOOK_SECRET
const razorpay_key_id = process.env.RAZORPAY_KEY;
const razorpay_key_secret = process.env.RAZORPAY_TOKEN;
const razorpay_order_expire_time = 30 * 60; //30 min
const razorpay_order_redis_key = "razorpay_order" 

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
  FRONTEND_URL,
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
  VOICE_CLONE_REPO,
  VOICE_CLONE_REPO_API,
  LIP_SYNC_REPO,
  LIP_SYNC_REPO_API,
  DURATION,
  EDGE_TTS_REPO,
  EDGE_TTS_REPO_API,
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
  videoUploadJobName,
  active_job_time,
  active_job_data,
  active_job_zset,
  CLOUDFLARE_WORKER_KEY,
  CLOUDFLARE_WORKER_URL,
  CLOUDFLARE_TXT2IMG,
  CLOUDFLARE_IMG2IMG,
  ASSEMBLY_AI_KEY,
  S3_ACCESS_KEY,
  S3_API,
  S3_API_TOKEN,
  S3_PUBLIC_BUCKET,
  S3_PRIVATE_BUCKET,
  S3_SECRET_KEY,
  S3_REGION,
  S3_CDN,
  audio_prefix,
  video_prefix,
  image_prefix,
  razorpay_webhook_secret,
  razorpay_key_id,
  razorpay_key_secret,
  razorpay_order_expire_time,
  razorpay_order_redis_key
}

