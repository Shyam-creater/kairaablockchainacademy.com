import { CatchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { redis } from "../utils/redis.js";
import jwt from "jsonwebtoken";
import { updateAccessToken } from "../controllers/user.controller.js";

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
      const user = await redis.get(decoded.id);

      if (!user) {
        return next(
          new ErrorHandler("Please login ", 400)
        );
      }

      req.user = JSON.parse(user);

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
