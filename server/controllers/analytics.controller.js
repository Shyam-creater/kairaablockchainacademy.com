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
// get order analytics -- only admin/staff
export const getOrderAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
      // Assuming Order model has a `courseId` which we can use to filter, 
      // but without complex joins, we might just allow admin for now, or fetch courses first.
      // Since it's complex, let's keep it admin only, or if staff, filter by courses they own.
      if (req.user.role !== "admin") {
         return next(new ErrorHandler("Only admin can view all orders", 403));
      }
      const orders = await generateLast12MonthsData(Order);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

// get courses analytics -- only admin/staff
export const getCourseAnalytics = CatchAsyncError(async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { instructorId: req.user._id };
    const courses = await generateLast12MonthsData(Course, filter);
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
