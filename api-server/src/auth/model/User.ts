import mongoose, { Schema } from "mongoose";
import { Provider, UserRole } from "../../constants/provider";

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


export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
