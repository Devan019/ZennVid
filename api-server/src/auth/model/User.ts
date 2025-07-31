import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import { Provider } from "../../constants/provider";

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
  points : {
    type: Number,
    default: 50,
  },
  profilePicture: {
    type: String,
  },
})


export const User = mongoose.models.User || mongoose.model("User", UserSchema);
