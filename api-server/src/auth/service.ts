import { User } from "./model/User";
import { getOtp } from "../utils/OptGenerater";
import { Provider } from "../constants/provider";
import { ACCESS_KEY } from "../env_var";
import jwt from "jsonwebtoken"
import { sendMail } from "../utils/SendMail";
import { IUser } from "../constants/interfaces";
import { comparePassword, hashPassword } from "../utils/hash_password";
import { redisClient } from "../utils/redisClient";


export const createTmpUserService = async (
  { email, password, provider, username }: IUser,
) => {
  try {

    //check user
    const exitsUser = await User.findOne({ email });
    if (exitsUser) {
      return {
        status: 409,
        message: "User already exists",
        success: false,
        data: null
      }
    }


    //gen otp
    const otp = getOtp();

    //hash password
    const hashedPassword = await hashPassword(password);

    //save user in redis with otp
    await redisClient.set(`tmp_user_${email}`, JSON.stringify({
      email,
      password: hashedPassword,
      provider : Provider.CREDENTIALS,
      username,
      otp
    }), "EX", 10 * 60) //expire in 10 min


    try {
      await sendMail({
        from: "devanchauhan012@gmail.com",
        to: email,
        subject: "ZennVid - Verify your email",
        html: `<p>Hi, ${username} </p>
             <p>Thank you for signing up on ZennVid. Please verify your email by entering the following OTP:</p>
             <h2>${otp}</h2>
             <p>This OTP is valid for 10 minutes.</p>
             <p>If you did not request this, please ignore this email.</p>
             <p>Best regards,</p>
             <p>ZennVid Team</p>`
      })
    } catch (error) {
      //delete tmp user from redis
      await redisClient.del(`tmp_user_${email}`);

      return {
        status: 500,
        message: "Failed to send OTP email",
        success: false,
        data: error
      }
    }

    return {
      status: 200,
      message: "Otp send !!!",
      success: true,
      data: {
        user: {
          email: email,
          provider: provider,
          username: username
        }
      }
    };

  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: error
    }
  }
}

export const createUserService = async (user: IUser) => {
  try {
    const newUser = new User({
      email: user.email,
      password: user.password,
      provider: user.provider,
      username: user.username
    });
    await newUser.save();

    return {
      status: 201,
      message: "User created successfully",
      success: true,
      data: { user: newUser }
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: error
    }
  }
}

export const signInUserService = async ({ email, password, provider }: { email: string; password: string; provider: string }) => {
  try {
    const user = await User.findOne({
      email
    });

    if (!user?.password) {
      return {
        status: 400,
        message: "Not a credentials based sign in",
        success: false,
        data: null
      };
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!user || !(passwordMatch)) {
      return {
        status: 401,
        message: "Invalid credentials",
        success: false,
        data: null
      };
    }

    if (user.provider !== provider) {
      return {
        status: 409,
        message: "Provider mismatch",
        success: false,
        data: null
      };
    }

    return {
      status: 200,
      message: "User signed in successfully",
      success: true,
      data: { user }
    };

  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: error
    }
  }
}


export const GetUserByTokenService = async (token: string) => {
  try {

    if (!token) {
      return {
        status: 401,
        message: "Unauthorized",
        success: false,
        data: null
      };
    }

    const decoded = jwt.verify(token, ACCESS_KEY ?? "");

    const user = {
      _id : (decoded as any).id,
      email : (decoded as any).email,
      provider : (decoded as any).provider,
      username : (decoded as any).username,
      credits : (decoded as any).credits,
      profilePicture : (decoded as any).profilePicture
    }


    if (!user) {
      return {
        status: 404,
        message: "User not found",
        success: false,
        data: null
      };
    }

    return {
      status: 200,
      message: "User retrieved successfully",
      success: true,
      data: { user }
    };

  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: null
    };
  }
}

export const GetUserByIdService = async (userId: string) => {
  try {
    const user = await User.findById(userId).select("-password");
    return {
      status: 200,
      message: "User fetched successfully",
      success: true,
      data: user
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: error
    };
  }
}

export const DeleteUserService = async (userId: string) => {
  try {
    await User.findByIdAndDelete(userId);
    return {
      status: 204,
      message: "User deleted successfully",
      success: true,
      data: null
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: error
    }
  }
}

export const UpdateUserService = async (userId: string, username: string, credits: number) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found",
        success: false,
        data: null
      }
    }
    user.username = username ?? user.username;
    user.credits = credits ?? user.credits;
    await user.save();
    return {
      status: 200,
      message: "User updated successfully",
      success: true,
      data: user
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      success: false,
      data: error
    };
  }
}
