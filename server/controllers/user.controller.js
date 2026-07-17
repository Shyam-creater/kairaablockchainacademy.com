import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/userModel.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import sendMail from "../utils/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
import { sendToken } from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/jwt.js";
import { getAllRegistrationsService, getUserById } from "../services/user.service.js";
import cloudinary from "cloudinary";
import {
  getAllUsersService,
  updateUserRoleService,
} from "../services/user.service.js";
import { writeAuditLog } from "../services/admin.service.js";
import Registration from "../models/registrationModel.js";
import bcrypt from "bcryptjs";
import ActivityLog from "../models/activityLogModel.js";
import LoginHistory from "../models/loginHistoryModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, gender } = req.body;
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    // Security Fix: Hash password BEFORE placing it in JWT to prevent plaintext exposure
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      gender,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

export const createActivationToken = (user) => {
  // Security Fix: 6-digit OTP
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
export const activateUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { activation_code, activation_token } = req.body;

    let newUser;
    try {
      newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    } catch (error) {
      return next(new ErrorHandler("Invalid or expired activation token", 400));
    }

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password, phoneNumber, gender } = newUser.user;
    const existUser = await User.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("User already exists", 400));
    }
    const user = await User.create({
      name,
      email,
      password, // this is already hashed from registrationUser
      phoneNumber,
      gender,
      isVerified: true
    });

    await ActivityLog.create({
      userId: user._id,
      action: "ACCOUNT_CREATED",
    });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log("error===>", error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// login user
export const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email || password)) {
      return next(new ErrorHandler("Please enter your email & password", 400));
    }

    // Security Fix: Explicitly select password since it's hidden by default now
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400)); // Changed to prevent user enumeration
    }

    user.lastLogin = Date.now();
    await user.save();

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "Unknown Device";
    
    await LoginHistory.create({
      userId: user._id,
      ipAddress: ip,
      browser: userAgent,
    });

    await ActivityLog.create({
      userId: user._id,
      action: "LOGIN_EVENT",
      ipAddress: ip,
      deviceInfo: userAgent,
    });

    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// logout user

export const logoutUser = CatchAsyncError(async (req, res, next) => {
  try {
    // const accessToken = req.headers.Authorization;
    // const accessToken=req.cookies.accessToken
    // res.cookie("access_token", "", { maxAge: 1 });
    // res.cookie("refresh_token", "", { maxAge: 1 });
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const userId = req.user?._id;
    console.log(userId);
    redis.del(userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
    // next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});


// update access token

export const updateAccessToken = CatchAsyncError(async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    console.log(`update token ${refresh_token}`);
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    if (!decoded) {
      return next(new ErrorHandler("Could not refresh token", 400));
    }

    let session = await redis.get(decoded.id);
    let user;

    if (!session) {
      const dbUser = await User.findById(decoded.id);
      if (!dbUser) {
        return next(new ErrorHandler("Please login to access", 400));
      }
      user = dbUser;
    } else {
      user = JSON.parse(session);
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "3d",
    });

    req.user = user;

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    await redis.set(user._id, JSON.stringify(user), "Ex", 604800); //7days

    // res.status(200).json({
    //   success: true,
    //   user,
    //   accessToken,
    // });
    return next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get user info
export const getUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    getUserById(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// social auth
export const socialAuth = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const newUser = await User.create({ email, name, avatar, lastLogin: Date.now() });
      sendToken(newUser, 200, res);
    } else {
      user.lastLogin = Date.now();
      await user.save();
      sendToken(user, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update userInfo

export const updateUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (name && user) {
      user.name = name;
    }

    await user?.save();

    await redis.set(userId, JSON.stringify(user));
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update password

export const updatePassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please enter old and new password", 400));
    }
    const user = await User.findById(req.user?._id).select("+password");
    // If user registered through social auth- password won't exist
    if (user?.password === undefined) {
      return next(new ErrorHandler("Invalid user", 400));
    }
    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid old password", 400));
    }
    user.password = newPassword;

    await user.save();
    await redis.set(req.user?._id, JSON.stringify(user));
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update profile picture
export const updateProfilePicture = CatchAsyncError(async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (avatar && user) {
      // if already avatar exist delete the previous one and paste the new img
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          // width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    } else {
      // if user register through social auth avatar won't exist
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        // width: 150,
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await user.save();
    await redis.set(userId, JSON.stringify(user));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all users-admin

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  try {
    await getAllUsersService(res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
// get all registrations

export const getAllRegistrations = CatchAsyncError(async (req, res, next) => {
  try {
    getAllRegistrationsService(res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update user role
export const updateUserRole = CatchAsyncError(async (req, res, next) => {
  try {
    const { id, email, role } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      const uid = isUserExist._id;
      await updateUserRoleService(res, uid, role);
      const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
      await writeAuditLog({
        actor: req.user,
        action: "UPDATE_USER_ROLE",
        target: email,
        details: { role },
        ip,
      });
    } else {
      res.status(400).json({
        sucess: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete user- admin
export const deleteUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
    await writeAuditLog({
      actor: req.user,
      action: "DELETE_USER",
      target: user.email,
      details: { userId: id, name: user.name },
      ip,
    });

    await user.deleteOne({ id });
    await redis.del(id);
    res.status(200).json({
      success: true,
      message: "user deleted succesfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// course registration


export const courseRegistration=CatchAsyncError(async(req,res,next)=>{
  try{
    const {firstName, lastName,email, phoneNumber,course}=req.body;
  
    const register = await Registration.create({
      firstName, lastName,email, phoneNumber,course
    });
    res.status(201).json({
      success: true,
      message:"Form Submitted",
      register
    });
  }catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
})
// forgot password
export const forgotPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler('Please enter your email', 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = expiry;
    await user.save();

    const data = { user: { name: user.name }, resetPasswordOtp: otp };
    try {
      await sendMail({
        email: user.email,
        subject: 'Password Reset Request',
        template: 'forgot-password-mail.ejs',
        data,
      });
      res.status(200).json({
        success: true,
        message: 'OTP sent to your email successfully',
      });
    } catch (error) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpiry = undefined;
      await user.save();
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// reset password
export const resetPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return next(new ErrorHandler('Please provide email, OTP and new password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    if (user.resetPasswordOtp !== otp) {
      return next(new ErrorHandler('Invalid OTP', 400));
    }

    if (user.resetPasswordOtpExpiry < Date.now()) {
      return next(new ErrorHandler('OTP has expired', 400));
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();
    await redis.set(user._id, JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const toggleFavorite = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return next(new ErrorHandler('Course ID is required', 400));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const isFavorite = user.favorites.find((fav) => fav.courseId === courseId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter((fav) => fav.courseId !== courseId);
    } else {
      // Add to favorites
      user.favorites.push({ courseId });
    }

    await user.save();
    await redis.set(user._id, JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      user
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

