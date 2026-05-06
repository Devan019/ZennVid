import mongoose, { Schema } from "mongoose";
import { Provider, UserRole } from "../../constants/provider";
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
    default: 50,
  },
  profilePicture: {
    type: String,
  },
  role : {
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  },
}, {timestamps : true})

UserSchema.post("findOneAndDelete", async function(doc) {
  if (doc) {
    // Delete associated refresh token
    await RefreshToken.deleteOne({ user: doc._id });
  }
})

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
