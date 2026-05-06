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
    required: true 
  }
})


//  Auto-delete the document when it expires!
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.models.RefreshToken ?? mongoose.model("RefreshToken", RefreshTokenSchema);
