import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { generateLast12MonthsData } from "../utils/analytics.generator.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Order from "../models/orderModel.js";
// get users analytics -- only admin
export const getUserAnalytics = CatchAsyncError(async (req, res, next) => {
  try {
    const users = await generateLast12MonthsData(User);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// get order analytics -- only admin
export const getOrderAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
      const orders = await generateLast12MonthsData(Order);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

// get courses analytics -- only admin
export const getCourseAnalytics = CatchAsyncError(async (req, res, next) => {
  try {
    const courses = await generateLast12MonthsData(Course);
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
