import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import { Provider } from "../../constants/provider";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password : {
    type: String,
  },
  provider: {
    type: String,
    enum: Provider,
    default: Provider.CREDENTIALS, 
  }
})

UserSchema.pre("save", async function () {
  if(!this.password) return;
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
