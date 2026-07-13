import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Meeting from "../models/meetingModel.js";
import Assignment from "../models/assignmentModel.js";
import ActivityLog from "../models/activityLogModel.js";
import DashboardAnalytics from "../models/dashboardAnalyticsModel.js";
import LearningStreak from "../models/learningStreakModel.js";
import Achievement from "../models/achievementModel.js";
import DailyActivity from "../models/dailyActivityModel.js";
import LectureProgress from "../models/lectureProgressModel.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

export const getWorkspaceDashboard = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get user and their courses
    const user = await User.findById(userId).lean();
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const courseIds = user.courses.map((c) => c.courseId);

    // Prepare promises for parallel execution
    const [
      courses,
      activities,
      assignments,
      meetings,
      analytics,
      streak,
      achievements,
      dailyActivities,
      lectureProgress,
    ] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).lean(),
      ActivityLog.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Assignment.find({ course: { $in: courseIds } }).lean(),
      Meeting.find({ courseId: { $in: courseIds } }).sort({ date: 1 }).lean(),
      DashboardAnalytics.findOne({ user: userId }).lean(),
      LearningStreak.findOne({ user: userId }).lean(),
      Achievement.find({ user: userId }).lean(),
      DailyActivity.find({ user: userId }).sort({ date: -1 }).limit(7).lean(),
      LectureProgress.find({ user: userId }).lean(),
    ]);

    // Data Aggregation & Structuring for 15 Sections
    
    // Section 1: Overview stats (Total courses, assignments, etc.)
    const overview = {
      totalCourses: courses.length,
      activeAssignments: assignments.length,
      upcomingMeetings: meetings.filter(m => new Date(m.date) > new Date()).length,
      completedLectures: lectureProgress.filter(lp => lp.completionPercentage === 100).length
    };

    // Section 2: Ongoing Courses
    const ongoingCourses = courses.map(c => {
      const progress = lectureProgress.filter(lp => String(lp.course) === String(c._id));
      const avgProgress = progress.length ? progress.reduce((acc, p) => acc + p.completionPercentage, 0) / progress.length : 0;
      return {
        _id: c._id,
        title: c.name || c.title,
        progress: avgProgress
      };
    });

    // Section 3: Learning Streak
    const learningStreakData = streak || { currentStreak: 0, highestStreak: 0 };

    // Section 4: Performance Analytics
    const performanceMetrics = analytics || { strongestTopic: "N/A", weakestTopic: "N/A", averageWatchSpeed: 1, overallProgress: 0 };

    // Section 5: Recent Activities
    const recentActivities = activities;

    // Section 6: Upcoming Meetings / Classes
    const upcomingSchedule = meetings.filter(m => new Date(m.date) > new Date()).slice(0, 5);

    // Section 7: Pending Assignments
    const pendingAssignments = assignments.slice(0, 5);

    // Section 8: Achievements
    const userAchievements = achievements;

    // Section 9: Daily Activity Chart Data
    const activityChart = dailyActivities;

    // Section 10: Profile summary
    const profileSummary = {
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url || "",
      role: user.role
    };

    // Constructing the final dashboard response
    res.status(200).json({
      success: true,
      data: {
        overview,
        ongoingCourses,
        learningStreak: learningStreakData,
        performanceMetrics,
        recentActivities,
        upcomingSchedule,
        pendingAssignments,
        achievements: userAchievements,
        activityChart,
        profileSummary,
        // The other 5 sections can be mapped or left for frontend expansion
        section11: "placeholder for extra metrics",
        section12: "placeholder for recommended courses",
        section13: "placeholder for peer comparison",
        section14: "placeholder for mentor feedback",
        section15: "placeholder for goal tracking"
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
