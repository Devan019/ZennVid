import mongoose from "mongoose";
import { MONGO_URI } from "../env_var";

const mongoUri = MONGO_URI || "mongodb://localhost:27017/zennvid";

async function connectToMongo() {

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

export default connectToMongo;