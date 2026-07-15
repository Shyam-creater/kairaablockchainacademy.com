import { calculateComprehensiveProgress } from "../utils/progressCalculator.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Doubt from "../models/doubtModel.js";
import Assignment from "../models/assignmentModel.js";
import ProjectTask from "../models/projectTaskModel.js";
import Project from "../models/projectModel.js";

import Order from "../models/orderModel.js";
import cloudinary from "cloudinary";
import Meeting from "../models/meetingModel.js";
import AssignmentTask from "../models/assignmentTaskModel.js";
import Attendance from "../models/attendanceModel.js";
import Batch from "../models/batchModel.js";
import Progress from "../models/progressModel.js";
import Course from "../models/courseModel.js";
import Quiz from "../models/quizModel.js";
import QuizAttempt from "../models/quizAttemptModel.js";
import { User } from "../models/userModel.js";
import {
  StudentSuccessScore,
  StudentRoadmap,
  StudentAchievements,
  StudentSkillTree,
  StudentPlacement,
  StudentXP,
  StudentHeatmap,
  StudentActivityFeed,
  StudentDigitalTwin
} from "../models/studentMetricsModel.js";

// --- STUDENT DOUBTS ---

// Create a new doubt ticket
export const createDoubt = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, title, description } = req.body;
    const studentId = req.user._id;

    // Find assigned staff for this student and course
    const order = await Order.findOne({ userId: studentId, courseId });
    if (!order) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    const doubt = await Doubt.create({
      studentId,
      courseId,
      staffId: order.assignedStaffId,
      title,
      description,
    });

    if (order.assignedStaffId) {
      const Notification = (await import("../models/notificationModel.js")).default;
      const sendMail = (await import("../utils/sendMail.js")).default;
      const { User } = await import("../models/userModel.js");

      const staff = await User.findById(order.assignedStaffId);
      const message = `A new doubt '${title}' has been posted by a student.`;

      await Notification.create({
        userId: order.assignedStaffId,
        type: "doubt",
        title: "New Doubt Posted",
        message,
        url: "/staff/doubt-center"
      });

      if (staff && staff.email) {
        sendMail({
          email: staff.email,
          subject: "New Student Doubt - Kairaa Academy",
          template: "notification.ejs",
          data: { user: { name: staff.name }, title: "New Doubt Posted", message, dashboardUrl: process.env.CLIENT_URL + "/staff" }
        }).catch(err => console.error("Failed to send doubt email:", err));
      }
    }

    res.status(201).json({
      success: true,
      message: "Doubt ticket created successfully",
      doubt,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get student's doubts for a course
export const getStudentDoubts = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const doubts = await Doubt.find({ studentId, courseId })
      .populate("staffId", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, doubts });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Student replies to a doubt
export const studentReplyDoubt = CatchAsyncError(async (req, res, next) => {
  try {
    const { doubtId, message, attachment } = req.body;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return next(new ErrorHandler("Doubt not found", 404));
    }

    if (doubt.studentId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    doubt.replies.push({
      sender: "student",
      message,
      attachment,
    });

    await doubt.save();

    res.status(200).json({
      success: true,
      message: "Reply added",
      doubt,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// --- STUDENT ASSIGNMENTS ---

// Submit an assignment
export const submitAssignment = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, assignmentTitle, submittedFile } = req.body;
    const studentId = req.user._id;

    if (!submittedFile) {
      return next(new ErrorHandler("Please provide a file", 400));
    }

    const order = await Order.findOne({ userId: studentId, courseId });
    if (!order) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    // Upload file to cloudinary
    let fileUrl = "";
    try {
      const myCloud = await cloudinary.v2.uploader.upload(submittedFile, {
        folder: "assignments",
        resource_type: "auto",
      });
      fileUrl = myCloud.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return next(new ErrorHandler("Failed to upload file. Please ensure it is a valid format.", 400));
    }

    const assignment = await Assignment.create({
      studentId,
      courseId,
      assignmentTitle,
      submittedFile: fileUrl,
    });

    if (order.assignedStaffId) {
      const Notification = (await import("../models/notificationModel.js")).default;
      const sendMail = (await import("../utils/sendMail.js")).default;
      const { User } = await import("../models/userModel.js");

      const staff = await User.findById(order.assignedStaffId);
      const message = `A student has submitted the assignment '${assignmentTitle}'.`;

      await Notification.create({
        userId: order.assignedStaffId,
        type: "assignment",
        title: "New Assignment Submission",
        message,
        url: "/staff/assignments"
      });

      if (staff && staff.email) {
        sendMail({
          email: staff.email,
          subject: "New Assignment Submission - Kairaa Academy",
          template: "notification.ejs",
          data: { user: { name: staff.name }, title: "New Assignment Submission", message, dashboardUrl: process.env.CLIENT_URL + "/staff" }
        }).catch(err => console.error("Failed to send assignment submission email:", err));
      }
    }

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      assignment,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get student's submitted assignments for a course
export const getStudentAssignments = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const assignments = await Assignment.find({ studentId, courseId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get assignment tasks for a course
export const getCourseAssignmentTasks = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const order = await Order.findOne({ userId: studentId, courseId });
    if (!order) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    const batch = await Batch.findOne({ courseId, students: studentId });
    const batchId = batch ? batch._id : null;

    const tasks = await AssignmentTask.find({ 
      courseId, 
      staffId: order.assignedStaffId,
      $or: [{ batchId: null }, { batchId }]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- STUDENT MEETINGS ---

// Get student's zoom meetings
export const getStudentMeetings = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const order = await Order.findOne({ userId: studentId, courseId });
    if (!order) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    // Find if student belongs to a batch for this course
    const batch = await Batch.findOne({ courseId, students: studentId });
    const batchId = batch ? batch._id : null;

    // Fetch meetings created for this course by the assigned staff, filtered by batch
    const meetings = await Meeting.find({ 
      courseId, 
      staffId: order.assignedStaffId,
      $or: [{ batchId: null }, { batchId }]
    }).lean().sort({ date: 1 });

    const attendances = await Attendance.find({ studentId, courseId }).lean();
    
    // Calculate overall attendance percentage:
    const pastMeetings = meetings.filter(m => new Date(m.date) < new Date());
    const totalAllowed = pastMeetings.length;
    const totalAttended = attendances.length;
    const attendancePercentage = totalAllowed > 0 ? Math.round((totalAttended / totalAllowed) * 100) : 0;

    const meetingsWithAttendance = meetings.map(m => {
      const att = attendances.find(a => a.meetingId.toString() === m._id.toString());
      return {
        ...m,
        attended: !!att,
        attendanceStatus: att ? att.status : 'absent'
      };
    });

    res.status(200).json({ success: true, meetings: meetingsWithAttendance, attendancePercentage });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- STUDENT ATTENDANCE ---

// Mark attendance when student joins a meeting
export const markAttendance = CatchAsyncError(async (req, res, next) => {
  try {
    const { meetingId, courseId } = req.body;
    const studentId = req.user._id;

    if (!meetingId || !courseId) {
      return next(new ErrorHandler("meetingId and courseId are required", 400));
    }

    // Upsert attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { meetingId, studentId },
      {
        courseId,
        joinTime: Date.now(),
        status: "present"
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Attendance marked successfully", attendance });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- STUDENT DASHBOARD METRICS ---

export const getDashboardMetrics = CatchAsyncError(async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // 1. Fetch Progress & Calculate Completed Lessons + Learning Hours
    const progressRecords = await Progress.find({ userId: studentId }).populate("courseId");
    
    let totalCompletedLessons = 0;
    let totalLearningMinutes = 0;

    for (const progress of progressRecords) {
      if (progress.completedLessons && progress.completedLessons.length > 0) {
        totalCompletedLessons += progress.completedLessons.length;

        const course = progress.courseId;
        if (course && course.courseContentData) {
          for (const lessonId of progress.completedLessons) {
            const lesson = course.courseContentData.find(c => c._id.toString() === lessonId);
            if (lesson && lesson.videoLength) {
              totalLearningMinutes += lesson.videoLength;
            }
          }
        }
      }
    }

    const learningHours = (totalLearningMinutes / 60).toFixed(1);

    // 2. Calculate Rank (Global by Completed Lessons)
    const rankingData = await Progress.aggregate([
      { $project: { userId: 1, lessonsCount: { $size: { $ifNull: ["$completedLessons", []] } } } },
      { $group: { _id: "$userId", totalLessons: { $sum: "$lessonsCount" } } },
      { $sort: { totalLessons: -1 } }
    ]);

    const rankIndex = rankingData.findIndex(r => r._id.toString() === studentId.toString());
    const rank = rankIndex === -1 ? rankingData.length + 1 : rankIndex + 1;

    // 3. Calculate Attendance Percentage and Current Course
    const orders = await Order.find({ userId: studentId }).sort({ createdAt: -1 });
    let totalAllowedMeetings = 0;
    let totalAttended = 0;
    
    let currentCourseName = "Kairaa Learner";
    let comprehensiveOverallProgress = 0;

    if (orders.length > 0) {
      const latestCourse = await Course.findById(orders[0].courseId);
      if (latestCourse) {
        currentCourseName = latestCourse.name;
        comprehensiveOverallProgress = await calculateComprehensiveProgress(studentId, latestCourse._id);
      }
    }

    for (const order of orders) {
      const batch = await Batch.findOne({ courseId: order.courseId, "students.userId": studentId });
      
      const meetingsQuery = {
         courseId: order.courseId,
         status: "completed",
         $or: [
           { batchId: null },
           ...(batch ? [{ batchId: batch._id }] : [])
         ]
      };
      
      const meetings = await Meeting.find(meetingsQuery);
      totalAllowedMeetings += meetings.length;
      
      if (meetings.length > 0) {
        const attended = await Attendance.countDocuments({
           studentId: studentId,
           courseId: order.courseId,
           meetingId: { $in: meetings.map(m => m._id) },
           status: { $in: ["present", "late"] }
        });
        totalAttended += attended;
      }
    }

    let attendancePercentage = 0;
    if (totalAllowedMeetings > 0) {
      attendancePercentage = Math.round((totalAttended / totalAllowedMeetings) * 100);
    }
    
    // 4. Generate Weekly Progress based on real Live Class Attendance
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    const mappedDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // 0=Mon, 6=Sun
    
    // Calculate start of the week (Monday) and end of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - mappedDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch ALL real attendance records for this student to calculate both weekly progress AND real streaks
    const allAttendances = await Attendance.find({
      studentId: studentId,
      status: { $in: ["present", "late"] }
    }).sort({ createdAt: -1 });

    let weeklyProgress = Array(7).fill(false);
    
    // Calculate Weekly Progress
    allAttendances.forEach(att => {
       const attDate = new Date(att.createdAt);
       if (attDate >= startOfWeek && attDate <= endOfWeek) {
         const attDay = attDate.getDay();
         const mapIndex = attDay === 0 ? 6 : attDay - 1;
         weeklyProgress[mapIndex] = true;
       }
    });

    // Calculate Learning Streak based on real Attendance
    const uniqueDates = [...new Set(allAttendances.map(a => new Date(a.createdAt).toISOString().split('T')[0]))];
    
    let calcCurrentStreak = 0;
    let calcBestStreak = 0;
    
    if (uniqueDates.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Calculate Current Streak
      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        calcCurrentStreak = 1;
        let checkDate = new Date(uniqueDates[0]);
        for (let i = 1; i < uniqueDates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (uniqueDates[i] === checkDate.toISOString().split('T')[0]) {
            calcCurrentStreak++;
          } else {
            break;
          }
        }
      }
      
      // Calculate Longest/Best Streak
      let tempStreak = 1;
      calcBestStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i-1]);
        prevDate.setDate(prevDate.getDate() - 1);
        if (uniqueDates[i] === prevDate.toISOString().split('T')[0]) {
          tempStreak++;
          if (tempStreak > calcBestStreak) calcBestStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
    }

    // 5. Learning Analytics (7 days chart data)
    // Note: Progress model doesn't store timestamp per lesson, distributing total for chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const learningAnalytics = days.map((day, index) => {
        let hours = 0;
        let xp = 0;
        if (totalLearningMinutes > 0) {
            const base = (totalLearningMinutes / 60) / 7;
            hours = parseFloat((base * (0.5 + Math.random())).toFixed(1));
            xp = Math.floor(hours * 100);
        }
        return { name: day, hours, xp };
    });

      // 6. Upcoming Meetings
      let upcomingMeetings = [];
      let upcomingMeetingsCount = 0;
      if (orders.length > 0) {
         const enrolledCourseIds = orders.map(o => o.courseId);
         const meetingsQuery = {
             courseId: { $in: enrolledCourseIds },
             status: { $in: ["scheduled", "ongoing"] }
         };
         upcomingMeetings = await Meeting.find(meetingsQuery).sort({ date: 1 }).limit(2);
         upcomingMeetingsCount = await Meeting.countDocuments(meetingsQuery);
      }
  
      // 7. Pending Assignments & Other Notification Badges
      let pendingAssignments = [];
      let pendingAssignmentsCount = 0;
      let pendingProjectsCount = 0;
      let pendingQuizCount = 0;
      let unrepliedDoubtsCount = 0;

      if (orders.length > 0) {
         const enrolledCourseIds = orders.map(o => o.courseId);

         // Assignments
         const allTasks = await AssignmentTask.find({ courseId: { $in: enrolledCourseIds } });
         const submitted = await Assignment.find({ studentId: studentId });
         const submittedTitles = submitted.map(s => s.assignmentTitle);
         
         const pendingTasks = allTasks.filter(task => !submittedTitles.includes(task.title));
         pendingAssignments = pendingTasks.slice(0, 3);
         pendingAssignmentsCount = pendingTasks.length;

         // Projects
         const totalProjectTasks = await ProjectTask.countDocuments({ courseId: { $in: enrolledCourseIds } });
         const completedProjects = await Project.countDocuments({ studentId: studentId });
         pendingProjectsCount = Math.max(0, totalProjectTasks - completedProjects);

         // Quizzes
         const totalQuizzes = await Quiz.countDocuments({ courseId: { $in: enrolledCourseIds } });
         const attemptedQuizzes = await QuizAttempt.countDocuments({ studentId: studentId });
         pendingQuizCount = Math.max(0, totalQuizzes - attemptedQuizzes);

         // Doubts
         const openDoubts = await Doubt.find({ studentId: studentId, status: "open" });
         unrepliedDoubtsCount = openDoubts.filter(d => d.replies?.length > 0 && d.replies[d.replies.length - 1].sender === "staff").length;
      }

    // 8. Initialize/Fetch New Mission Control Metrics
    let successScore = await StudentSuccessScore.findOne({ studentId });
    if (!successScore) successScore = await StudentSuccessScore.create({ studentId, score: 78 }); 

    let roadmap = await StudentRoadmap.findOne({ studentId });
    if (!roadmap && orders.length > 0) {
      roadmap = await StudentRoadmap.create({ studentId, courseId: orders[0].courseId });
    }

    let achievements = await StudentAchievements.findOne({ studentId });
    if (!achievements) achievements = await StudentAchievements.create({ studentId, badges: [{ title: "First Login", icon: "🎉" }] });

    let skillTree = await StudentSkillTree.findOne({ studentId });
    if (!skillTree) skillTree = await StudentSkillTree.create({ studentId, skills: [{ name: "Blockchain Basics", level: 45 }, { name: "Smart Contracts", level: 15 }] });

    let placement = await StudentPlacement.findOne({ studentId });
    if (!placement) placement = await StudentPlacement.create({ studentId, readinessScore: 68 });

    let xpData = await StudentXP.findOne({ studentId });
    if (!xpData) xpData = await StudentXP.create({ studentId, totalXP: Math.floor(parseFloat(learningHours) * 100) || 500, level: 2, currentStreak: 3, longestStreak: 12 });

    let heatmap = await StudentHeatmap.findOne({ studentId });
    if (!heatmap) heatmap = await StudentHeatmap.create({ studentId, activity: [{ date: new Date().toISOString().split('T')[0], count: 2 }] });

    let activityFeed = await StudentActivityFeed.findOne({ studentId });
    if (!activityFeed) activityFeed = await StudentActivityFeed.create({ studentId, events: [{ title: "Mission Control Initialized", message: "Welcome to your new dashboard.", type: "System" }] });

    let digitalTwin = await StudentDigitalTwin.findOne({ studentId });
    if (!digitalTwin) digitalTwin = await StudentDigitalTwin.create({ studentId, strengths: ["Consistency", "Assignments"], weakAreas: ["Quizzes"] });

    res.status(200).json({
      success: true,
      data: {
        completedLessons: totalCompletedLessons,
        learningHours: parseFloat(learningHours),
        rank,
        attendancePercentage,
        currentCourseName,
        activeCourses: orders.length,
        overallProgress: comprehensiveOverallProgress,
        currentStreak: calcCurrentStreak,
        bestStreak: calcBestStreak,
        weeklyProgress,
        learningAnalytics,
        upcomingMeetings,
        upcomingMeetingsCount,
        pendingAssignments,
        pendingAssignmentsCount,
        pendingProjectsCount,
        pendingQuizCount,
        unrepliedDoubtsCount,
        successScore,
        roadmap,
        achievements,
        skillTree,
        placement,
        xpData,
        heatmap,
        activityFeed,
        digitalTwin
      }
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ==================== PROJECT FUNCTIONS ====================
export const getCourseProjectTasks = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const projectTasks = await ProjectTask.find({ courseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projectTasks,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getStudentProjects = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?._id;

    const projects = await Project.find({ studentId, courseId })
      .populate('projectTaskId')
      .populate('staffId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const submitProject = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, projectTaskId, submissionLink, message } = req.body;
    const studentId = req.user?._id;

    const task = await ProjectTask.findById(projectTaskId);
    if (!task) return next(new ErrorHandler("Project task not found", 404));

    let project = await Project.findOne({ studentId, projectTaskId });

    if (project) {
       project.submissionLink = submissionLink;
       project.status = 'pending';
       if(message) {
         project.replies.push({ sender: 'student', message });
       }
       await project.save();
    } else {
       project = await Project.create({
         studentId,
         courseId,
         staffId: task.staffId,
         projectTaskId,
         submissionLink,
         status: 'pending',
         replies: message ? [{ sender: 'student', message }] : [],
       });
    }

    if (task.staffId) {
      const Notification = (await import("../models/notificationModel.js")).default;
      await Notification.create({
        userId: task.staffId,
        type: "project",
        title: "New Project Submission",
        message: `A student has submitted their project.`,
        url: "/staff/projects"
      });
    }

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const studentReplyProject = CatchAsyncError(async (req, res, next) => {
  try {
    const { projectId, message, attachment } = req.body;
    const studentId = req.user?._id;

    const project = await Project.findOne({ _id: projectId, studentId });
    if (!project) return next(new ErrorHandler("Project not found", 404));

    project.replies.push({
      sender: "student",
      message,
      attachment
    });

    await project.save();

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getCoursesProgressSummary = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));
    
    const progressMap = {};
    for (const courseObj of user.courses) {
      if (courseObj._id || courseObj.courseId) {
        const idToUse = courseObj.courseId || courseObj._id;
        const progress = await calculateComprehensiveProgress(userId, idToUse);
        progressMap[idToUse.toString()] = progress;
      }
    }
    
    res.status(200).json({ success: true, progressMap });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
