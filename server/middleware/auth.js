import { CatchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { redis } from "../utils/redis.js";
import jwt from "jsonwebtoken";
import { updateAccessToken } from "../controllers/user.controller.js";
import { User } from "../models/userModel.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  
  
  // const access_token = req.headers.Authorization;
  const access_token=req.cookies.access_token
  // const access_token =localStorage.getItem('token');

  console.log(`jhfgjk ${access_token}`)

  // if (!access_token) {
  //   return next(new ErrorHandler("Please login to access this resource", 400));
  // }
console.log(`update accesToken called`)

const decoded= jwt.decode(access_token)
if(!decoded){
  return next(new ErrorHandler("access token is not valid",400))
}

    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
         updateAccessToken(req, res, next);
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } else {
      console.log("Token not expired, checking redis");
      let userSession = await redis.get(decoded.id);
      let userObj;

      if (!userSession) {
        console.log("Redis session empty, querying DB for user id:", decoded.id);
        const dbUser = await User.findById(decoded.id);
        if (!dbUser) {
          console.log("User not found in DB");
          return next(new ErrorHandler("Please login ", 400));
        }
        console.log("User found in DB, setting req.user");
        userObj = dbUser;
      } else {
        console.log("User found in Redis");
        userObj = JSON.parse(userSession);
      }

      req.user = userObj;
      console.log("Calling next() from auth.js");
      next();
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
