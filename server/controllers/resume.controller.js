import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CourseResume from "../models/courseResumeModel.js";

// Save or Update Resume Progress
export const saveResumeProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, sectionId, lectureId, playbackTime, completionPercentage } = req.body;
    const userId = req.user?._id;

    if (!courseId || !lectureId) {
      return next(new ErrorHandler("courseId and lectureId are required", 400));
    }

    let resume = await CourseResume.findOne({ userId, courseId });

    if (resume) {
      resume.sectionId = sectionId;
      resume.lectureId = lectureId;
      resume.playbackTime = playbackTime || 0;
      resume.completionPercentage = completionPercentage || 0;
      await resume.save();
    } else {
      resume = await CourseResume.create({
        userId,
        courseId,
        sectionId,
        lectureId,
        playbackTime: playbackTime || 0,
        completionPercentage: completionPercentage || 0,
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Resume Progress
export const getResumeProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id;

    const resume = await CourseResume.findOne({ userId, courseId });

    res.status(200).json({
      success: true,
      resume, // May be null if no progress exists
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
