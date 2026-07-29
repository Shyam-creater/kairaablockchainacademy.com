import Course from "../models/courseModel.js";
import Progress from "../models/progressModel.js";
import AssignmentTask from "../models/assignmentTaskModel.js";
import Assignment from "../models/assignmentModel.js";
import Meeting from "../models/meetingModel.js";
import Attendance from "../models/attendanceModel.js";
import ProjectTask from "../models/projectTaskModel.js";
import Project from "../models/projectModel.js";
import Batch from "../models/batchModel.js";

/**
 * Calculates a comprehensive progress percentage for a student in a specific course.
 * @param {string} userId - The user ID
 * @param {string} courseId - The course ID
 * @returns {Promise<number>} - Comprehensive progress percentage (0-100)
 */
export const calculateComprehensiveProgress = async (userId, courseId) => {
  try {
    // 1. Calculate Video Content Progress
    const course = await Course.findById(courseId);
    if (!course) return 0;
    
    const totalLessons = course.courseData?.length || course.courseContentData?.length || 0;
    const completedLessons = await Progress.countDocuments({ userId, courseId, isCompleted: true });
    const videoProgress = totalLessons > 0 ? (completedLessons / totalLessons) : null;

    // Determine the student's batch for this course (if any)
    const batch = await Batch.findOne({ courseId, "students.userId": userId });
    const batchQuery = batch ? { $in: [null, batch._id] } : null;

    // 2. Calculate Assignment Progress
    const assignmentQuery = { courseId };
    if (batchQuery) assignmentQuery.batchId = batchQuery;
    else assignmentQuery.batchId = null;

    const totalAssignmentTasks = await AssignmentTask.countDocuments(assignmentQuery);
    const completedAssignments = await Assignment.countDocuments({ studentId: userId, courseId });
    const assignmentProgress = totalAssignmentTasks > 0 ? (completedAssignments / totalAssignmentTasks) : null;

    // 3. Calculate Attendance Progress
    const meetingQuery = { courseId, status: "completed" };
    if (batchQuery) meetingQuery.batchId = batchQuery;
    else meetingQuery.batchId = null;

    const totalMeetings = await Meeting.countDocuments(meetingQuery);
    const attendedMeetings = await Attendance.countDocuments({ studentId: userId, courseId });
    const attendanceProgress = totalMeetings > 0 ? (attendedMeetings / totalMeetings) : null;

    // 4. Calculate Project Progress
    const projectQuery = { courseId };
    if (batchQuery) projectQuery.batchId = batchQuery;
    else projectQuery.batchId = null;

    const totalProjectTasks = await ProjectTask.countDocuments(projectQuery);
    const completedProjects = await Project.countDocuments({ studentId: userId, courseId });
    const projectProgress = totalProjectTasks > 0 ? (completedProjects / totalProjectTasks) : null;

    // Aggregate Progress
    let accumulatedProgress = 0;
    let dimensionsCount = 0;

    if (videoProgress !== null) {
      accumulatedProgress += videoProgress;
      dimensionsCount++;
    }
    if (assignmentProgress !== null) {
      accumulatedProgress += assignmentProgress;
      dimensionsCount++;
    }
    if (attendanceProgress !== null) {
      accumulatedProgress += attendanceProgress;
      dimensionsCount++;
    }
    if (projectProgress !== null) {
      accumulatedProgress += projectProgress;
      dimensionsCount++;
    }

    if (dimensionsCount === 0) return 0;

    const averageProgress = accumulatedProgress / dimensionsCount;
    return Math.min(100, Math.round(averageProgress * 100));

  } catch (error) {
    console.error(`Error calculating progress for user ${userId}, course ${courseId}:`, error);
    return 0;
  }
};
