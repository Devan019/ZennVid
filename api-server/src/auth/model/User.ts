import mongoose, { Schema } from "mongoose";
import { Provider } from "../../constants/provider";
import { RefreshToken } from "./RefreshToken";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password : {
    type: String,
  },
  provider: {
    type: String,
    enum: Provider,
    default: Provider.CREDENTIALS, 
  },
  username:{
    type: String,
    required: true,
  },
  credits : {
    type: Number,
    default: 40,
  },
  profilePicture: {
    type: String,
  },
}, {timestamps : true})

UserSchema.post("findOneAndDelete", async function(doc) {
  if (doc) {
    // Delete associated refresh token
    await RefreshToken.deleteOne({ user: doc._id });
  }
})

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
