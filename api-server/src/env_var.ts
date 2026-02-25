import { configDotenv } from "dotenv";
configDotenv();

export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zennvid";
export const AUTH_SECRET = process.env.AUTH_SECRET
export const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID
export const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET
export const AUTH_GOOGLE_REDIRECT_URI = process.env.AUTH_GOOGLE_REDIRECT_URI
export const RESEND_KEY = process.env.RESEND_KEY
export const AI_URI = process.env.AI_URI || "http://localhost:8080";
export const SADTALKER = process.env.SADTALKER || "http://localhost:9000";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const OPENAPI_SECERT=process.env.ENCRYPTION_SECRET;
export const OPENAPI_URL=process.env.OPENAPI_URL;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const HF_TOKEN = process.env.HF_TOKEN;
export const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;
export const NEBIUS_API_URL = process.env.NEBIUS_API_URL;
export const VOICE_CLONE_REPO = process.env.VOICE_CLONE_REPO;
export const VOICE_CLONE_REPO_API = process.env.VOICE_CLONE_REPO_API;
export const LIP_SYNC_REPO = process.env.LIP_SYNC_REPO;
export const LIP_SYNC_REPO_API = process.env.LIP_SYNC_REPO_API;
export const DURATION = process.env.LIP_SYNC_AUDIO_API;
export const TRANSLATE_REPO = process.env.TRANSLATE_REPO;
export const TRANSLATE_REPO_API = process.env.TRANSLATE_REPO_API;
export const EDGE_TTS_REPO = process.env.EDGE_TTS_REPO;
export const EDGE_TTS_REPO_API = process.env.EDGE_TTS_REPO_API;