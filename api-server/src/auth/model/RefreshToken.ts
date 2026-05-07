import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: { 
    type: Date, 
    required: true,
    expireAfterSeconds: 0 // This will make MongoDB automatically delete expired tokens 
  }
})


export const RefreshToken = mongoose.models.RefreshToken ?? mongoose.model("RefreshToken", RefreshTokenSchema);
