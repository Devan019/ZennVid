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
  otp : {
    type: String,
    default: null,
  },
  username: {
    type: String,
    required: true,
  }
})


export const TmpUser = mongoose.models.TmpUser || mongoose.model("TmpUser", UserSchema);
