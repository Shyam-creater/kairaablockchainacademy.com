import { redis } from "./redis.js";

// parse environment variables to integrate with fallback values
export const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || '15',
  10
); // in minutes

export const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "7",
  10
); // in days

// options for cookies
export const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // mins to ms
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true, 
};

export const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // days to ms
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true, 
};

export const sendToken = (user, statusCode, res) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // setup session to redis
  redis.set(user._id, JSON.stringify(user), "EX", refreshTokenExpire * 24 * 60 * 60);

  // only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
