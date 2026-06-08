import Course from "../models/courseModel.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";

export const createCourse = CatchAsyncError(async (data, res, next) => {
  try {
    const course = await Course.create(data);
    console.log(course);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getAllCoursesService = async (res) => {
  const courses = await Course.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    courses,
  });
};

