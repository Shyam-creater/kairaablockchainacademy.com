import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Progress from "../models/progressModel.js";
import Course from "../models/courseModel.js";

// Save progress periodically
export const saveProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, lessonId, currentTime, duration, sectionId } = req.body;
    const userId = req.user?._id;

    if (!courseId || !lessonId) {
      return next(new ErrorHandler("courseId and lessonId are required", 400));
    }

    const watchPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    let progress = await Progress.findOne({ userId, courseId, lessonId });

    if (progress) {
      progress.currentTime = currentTime;
      progress.duration = duration;
      // Only update watchPercentage if it increased (prevent rewinding from dropping it)
      if (watchPercentage > progress.watchPercentage) {
         progress.watchPercentage = watchPercentage;
      }
      progress.lastAccessedAt = Date.now();
      if (sectionId) progress.sectionId = sectionId;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId,
        courseId,
        sectionId,
        lessonId,
        currentTime,
        duration,
        watchPercentage,
      });
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Mark lesson as complete
export const markLessonWatched = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body; // or from params if it was /complete/:lessonId
    const userId = req.user?._id;

    if (!courseId || !lessonId) {
      return next(new ErrorHandler("courseId and lessonId are required", 400));
    }

    let progress = await Progress.findOne({ userId, courseId, lessonId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        lessonId,
        isCompleted: true,
        watchPercentage: 100
      });
    } else {
      progress.isCompleted = true;
      if (progress.watchPercentage < 80) progress.watchPercentage = 80; // guarantee at least 80% if explicitly completing
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

// Get overall course progress
export const getCourseProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id;

    const progresses = await Progress.find({ userId, courseId });
    const course = await Course.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const totalLessons = course.courseContentData.length;
    const completedLessons = progresses.filter(p => p.isCompleted).map(p => p.lessonId.toString());
    
    // Sort by lastAccessedAt to find the last watched lesson for Resume
    const sortedProgresses = [...progresses].sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));
    const lastWatched = sortedProgresses.length > 0 ? sortedProgresses[0] : null;

    const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100);

    res.status(200).json({
      success: true,
      progress: {
        completedLessons, // Return as array of IDs to keep frontend sidebar working
        lastWatchedLesson: lastWatched ? lastWatched.lessonId : null,
        resumeData: lastWatched
      },
      percentage,
      totalLessons,
      completedLessons: completedLessons.length,
      allProgress: progresses // Optional, in case frontend wants exact percentages per lesson
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
