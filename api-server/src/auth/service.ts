import { User } from "./model/User";
import { TmpUser } from "./model/tmpUser";
import { getOtp } from "../utils/OptGenerater";
import { Provider, UserRole } from "../constants/provider";
import { passwordCompare } from "../utils/passwordCompare";
import { AUTH_SECRET } from "../env_var";
import jwt from "jsonwebtoken"
import { sendMail } from "../utils/SendMail";
import { generateJWTtoken } from "../utils/jwtAssign";
import { IUser } from "../constants/interfaces";
import { comparePassword, hashPassword } from "../utils/hash_password";


export const createTmpUserService = async (
  { email, password, provider, username }: IUser,
) => {
  try {


    const exitsUser = await User.findOne({ email });
    const tmpExitsUser = await TmpUser.findOne({ email });
    if (exitsUser) {
      return {
        status: 409,
        message: "User already exists",
        success: false,
        data: null
      }
    }


    const otp = getOtp();
    if (tmpExitsUser) {
      await TmpUser.deleteOne({ _id: tmpExitsUser._id })
    }
    const encodePassword = await hashPassword(password); ;
    const newUser = new TmpUser({
      email,
      password: encodePassword,
      otp,
      username,
    });

    await newUser.save();

    await sendMail({
      from: "devanchauhan012@gmail.com",
      to: email,
      subject: "ZennVid - Verify your email",
      html: `<p>Hi, ${username} </p>
             <p>Thank you for signing up on ZennVid. Please verify your email by entering the following OTP:</p>
             <h2>${otp}</h2>
             <p>If you did not request this, please ignore this email.</p>
             <p>Best regards,</p>
             <p>ZennVid Team</p>`
    })

    return {
      status: 200,
      message: "Otp send !!!",
      success: true,
      data: {
        user: {
          email: email,
          _id: newUser._id,
          provider: newUser.provider,
          username: newUser.username
        }
      }
    };

  } catch (error) {
    console.log(error)
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
      username: user.username,
      role: UserRole.USER
    });
    await newUser.save();


    return {
      status: 201,
      message: "User created successfully",
      success: true,
      data: { user: newUser }
    }
  } catch (error) {
    console.log(error)
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

    // Here you would typically create a session or JWT token

    const token = generateJWTtoken({
      id: user._id.toString(),
      email: user.email,
      provider: user.provider,
      username: user.username,
      credits: user.credits,
      role: user.role,
    });

    return {
      status: 200,
      message: "User signed in successfully",
      success: true,
      data: { user, token }
    };

  } catch (error) {
    console.log(error)
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

    const decoded = jwt.verify(token, AUTH_SECRET ?? "");
    const user = await User.findById((decoded as any).id).select("-password");

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

export const CreateAdminService = async ({ email, password, username }: { email: string; password: string; username: string }) => {
  try {
    const existingAdmin = await User.findOne({ email, role: UserRole.ADMIN });
    if (existingAdmin) {
      return {
        status: 409,
        message: "Admin already exists",
        success: false,
        data: null
      }
    }
    const hashedPassword = await hashPassword(password);
    const newAdmin = new User({
      email,
      password: hashedPassword,
      provider: Provider.CREDENTIALS,
      username,
      role: UserRole.ADMIN,
      credits: 0
    });
    await newAdmin.save();

    return {
      status: 201,
      message: "Admin created successfully",
      success: true,
      data: { user: newAdmin }
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

export const GetAllUserService = async (
  { page, limit, search, createdAt }: { page: number; limit: number; search?: string; createdAt?: Date | string | undefined }
) => {
  try {

    const isNumber = !isNaN(search as any);

    const matchConditions: any = {};


    if (search) {
      matchConditions.$or = [
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { provider: { $regex: search, $options: "i" } },
        ...(isNumber
          ? [
            { credits: Number(search) },
          ]
          : []),
      ];
    }

    if (createdAt) {
      const startOfDay = new Date(createdAt);
      const endOfDay = new Date(createdAt);
      endOfDay.setHours(23, 59, 59, 999);

      matchConditions.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const users = await User.aggregate([
      { $match: matchConditions },
      { $match: { role: "user" } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { password: 0 } }
    ])
    return {
      status: 200,
      message: "Users fetched successfully",
      success: true,
      data: {
        users,
        total: await User.countDocuments(matchConditions),
        page: page,
        limit: limit
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

export const getAllUsersAsCSVService = async () => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    return {
      status: 200,
      message: "Users fetched successfully",
      success: true,
      data: users
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