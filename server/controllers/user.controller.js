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
import Registration from "../models/registrationModel.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = {
      name,
      email,
      password,
      phoneNumber,
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
        message: `Please check you email ${user.email} to activate your account`,
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
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

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
      console.log("JWT verified:", newUser);
    } catch (error) {
      console.error("JWT verification error:", error);
      return next(new ErrorHandler("Invalid or expired activation token", 400));
    }
    console.log("newUser.activationCode", newUser.activationCode);
    if (newUser.activationCode !== activation_code) {
      console.error(
        "Activation code mismatch:",
        newUser.activationCode,
        activation_code
      );
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password,phoneNumber } = newUser.user;
    const existUser = await User.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("User already exist", 400));
    }
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber
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

    const user = await User.findOne({ email });
    console.log(`user ${user}`);

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid password", 400));
    }
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
      return next(new ErrorHandler(message, 400));
    }

    const session = await redis.get(decoded.id);

    if (!session) {
      return next(new ErrorHandler("Please login to access", 400));
    }

    const user = JSON.parse(session);

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
      const newUser = await User.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
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
    getAllUsersService(res);
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
      const id = isUserExist._id;
      updateUserRoleService(res, id, role);
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