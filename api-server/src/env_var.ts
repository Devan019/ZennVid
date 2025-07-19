import { configDotenv } from "dotenv";
configDotenv();

export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zennvid";
export const AUTH_SECRET = process.env.AUTH_SECRET
export const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID
export const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET
export const RESEND_KEY = process.env.RESEND_KEY