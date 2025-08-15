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