import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Progress from "../models/progressModel.js";
import Course from "../models/courseModel.js";

export const markLessonWatched = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user?._id;

    if (!courseId || !lessonId) {
      return next(new ErrorHandler("courseId and lessonId are required", 400));
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedLessons: [lessonId],
        lastWatchedLesson: lessonId,
      });
    } else {
      progress.lastWatchedLesson = lessonId;
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      await progress.save();
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getCourseProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id;

    const progress = await Progress.findOne({ userId, courseId });
    const course = await Course.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const totalLessons = course.courseContentData.length;
    const completedLessons = progress ? progress.completedLessons.length : 0;
    const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    res.status(200).json({
      success: true,
      progress: progress || { completedLessons: [], lastWatchedLesson: null },
      percentage,
      totalLessons,
      completedLessons,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
