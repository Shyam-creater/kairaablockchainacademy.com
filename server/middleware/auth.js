import { CatchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { redis } from "../utils/redis.js";
import jwt from "jsonwebtoken";
import { updateAccessToken } from "../controllers/user.controller.js";
import { User } from "../models/userModel.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  try {
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);

    let userSession = await redis.get(decoded.id);
    let userObj;

    if (!userSession) {
      const dbUser = await User.findById(decoded.id);
      if (!dbUser) {
        return next(new ErrorHandler("Please login", 400));
      }
      userObj = dbUser;
    } else {
      userObj = JSON.parse(userSession);
    }

    req.user = userObj;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        return updateAccessToken(req, res, next);
      } catch (err) {
        return next(new ErrorHandler("Session expired, please login again", 400));
      }
    } else {
      return next(new ErrorHandler("Access token is not valid", 400));
    }
  }
});

// validate user role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
