import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Progress from "../models/progressModel.js";
import Meeting from "../models/meetingModel.js";
import Doubt from "../models/doubtModel.js";
import Assignment from "../models/assignmentModel.js";
import QuizAttempt from "../models/quizAttemptModel.js";
import CertificateRecommendation from "../models/certificateRecommendationModel.js";
import AssignmentTask from "../models/assignmentTaskModel.js";
import ProjectTask from "../models/projectTaskModel.js";
import Project from "../models/projectModel.js";

import Attendance from "../models/attendanceModel.js";
import Notification from "../models/notificationModel.js";
import mongoose from "mongoose";
import Batch from "../models/batchModel.js";

// Get assigned students for staff
export const getAssignedStudents = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const staff = await User.findById(staffId);
    if (!staff.assignedCourses || staff.assignedCourses.length === 0) {
      return res.status(200).json({
        success: true,
        assignedStudents: [],
      });
    }

    const assignedCourseIds = staff.assignedCourses;

    // Find all orders for the assigned courses and specifically assigned to this staff member
    const orders = await Order.find({ courseId: { $in: assignedCourseIds }, assignedStaffId: staffId }).lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        assignedStudents: [],
      });
    }

    const assignedStudents = [];

    // For each order, get user, course, and progress details
    for (const order of orders) {
      const user = await User.findById(order.userId).select("name email avatar _id");
      const course = await Course.findById(order.courseId).select("name _id courseData");
      
      if (user && course) {
        // Calculate progress
        let progressPercent = 0;
        try {
           const progressDoc = await Progress.findOne({
             userId: user._id,
             courseId: course._id
           });

           if (progressDoc && course.courseData && course.courseData.length > 0) {
             progressPercent = Math.round((progressDoc.completedLessons.length / course.courseData.length) * 100);
           }
        } catch(e) {
          console.error("Error fetching progress for user", user._id);
        }

        assignedStudents.push({
          orderId: order._id,
          student: user,
          course: {
             _id: course._id,
             name: course.name,
             courseData: course.courseData ? course.courseData.map(c => ({ _id: c._id, title: c.title })) : []
          },
          progress: progressPercent,
          assignedAt: order.updatedAt || order.createdAt
        });
      }
    }

    res.status(200).json({
      success: true,
      assignedStudents,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get batches for staff
export const getStaffBatches = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const staff = await User.findById(staffId);
    if (!staff.assignedCourses || staff.assignedCourses.length === 0) {
      return res.status(200).json({ success: true, batches: [] });
    }
    // Only fetch batches strictly assigned to this staff member
    const batches = await Batch.find({ staffId }).populate("courseId", "name").populate("students", "name email");
    res.status(200).json({ success: true, batches });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get comprehensive student progress for tracker
export const getStudentsProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const staff = await User.findById(staffId);
    
    if (!staff.assignedCourses || staff.assignedCourses.length === 0) {
      return res.status(200).json({
        success: true,
        studentsProgress: [],
      });
    }

    const assignedCourseIds = staff.assignedCourses;

    // Find all orders for the assigned courses and specifically assigned to this staff member
    const orders = await Order.find({ courseId: { $in: assignedCourseIds }, assignedStaffId: staffId }).lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        studentsProgress: [],
      });
    }

    const studentsProgress = [];

    for (const order of orders) {
      const user = await User.findById(order.userId).select("name email avatar _id lastLogin");
      const course = await Course.findById(order.courseId).select("name _id courseData");
      
      if (user && course) {
        // 1. Calculate Course Progress
        let progressPercent = 0;
        let completedLessonsCount = 0;
        try {
           const progressDoc = await Progress.findOne({
             userId: user._id,
             courseId: course._id
           });

           if (progressDoc && course.courseData && course.courseData.length > 0) {
             completedLessonsCount = progressDoc.completedLessons.length;
             progressPercent = Math.round((completedLessonsCount / course.courseData.length) * 100);
           }
        } catch(e) {
          console.error("Error fetching progress for user", user._id);
        }

        // 2. Fetch Quiz Average
        let quizAverage = 0;
        try {
          const attempts = await QuizAttempt.find({ userId: user._id, courseId: course._id });
          if (attempts.length > 0) {
            const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
            quizAverage = Math.round(totalScore / attempts.length);
          }
        } catch (e) {
          console.error("Error fetching quizzes", e);
        }

        // 3. Assignment Status
        let assignmentStatus = "No Assignments";
        try {
          const assignments = await Assignment.find({ studentId: user._id, courseId: course._id });
          if (assignments.length > 0) {
            const pending = assignments.filter(a => a.status === 'pending').length;
            if (pending > 0) {
              assignmentStatus = `${pending} Pending Review`;
            } else {
              assignmentStatus = "All Reviewed";
            }
          }
        } catch (e) {
          console.error("Error fetching assignments", e);
        }

        // 4. Follow-up Logic
        let needsFollowUp = false;
        let inactivityDays = 0;
        
        if (user.lastLogin) {
          const diffTime = Math.abs(Date.now() - new Date(user.lastLogin));
          inactivityDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (inactivityDays > 7) {
            needsFollowUp = true;
          }
        } else {
          // Never logged in
          needsFollowUp = true;
          inactivityDays = -1; 
        }

        // Check if certificate recommendation already exists
        const existingRecommendation = await CertificateRecommendation.findOne({
          studentId: user._id,
          courseId: course._id
        });

        studentsProgress.push({
          student: user,
          course: {
             _id: course._id,
             name: course.name
          },
          progress: progressPercent,
          completedLessons: completedLessonsCount,
          totalLessons: course.courseData?.length || 0,
          quizAverage,
          assignmentStatus,
          lastLogin: user.lastLogin,
          inactivityDays,
          needsFollowUp,
          recommendationStatus: existingRecommendation ? existingRecommendation.status : null
        });
      }
    }

    res.status(200).json({
      success: true,
      studentsProgress,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Schedule a meeting
export const scheduleMeeting = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const { courseId, batchId, topic, date, endDate, zoomLink } = req.body;

    if (!courseId || !topic || !date || !endDate) {
      return next(new ErrorHandler("Please provide course, topic, start date and end date", 400));
    }

    const meeting = await Meeting.create({
      staffId,
      courseId,
      batchId: batchId || null,
      topic,
      date,
      endDate,
      zoomLink,
    });

    // Notify targeted students
    const Notification = (await import("../models/notificationModel.js")).default;
    const sendMail = (await import("../utils/sendMail.js")).default;
    const { User } = await import("../models/userModel.js");
    let targetStudents = [];

    if (batchId) {
      const Batch = (await import("../models/batchModel.js")).default;
      const batch = await Batch.findById(batchId).populate("students", "name email");
      if (batch) targetStudents = batch.students;
    } else {
      const orders = await Order.find({ assignedStaffId: staffId, courseId }).populate("userId", "name email");
      targetStudents = orders.map(o => o.userId).filter(u => u != null);
    }

    const message = `A new meeting '${topic}' has been scheduled for ${new Date(date).toLocaleString()}.`;

    for (const student of targetStudents) {
      await Notification.create({
        userId: student._id,
        type: "meeting",
        title: "New Meeting Scheduled",
        message
      });

      if (student.email) {
        sendMail({
          email: student.email,
          subject: "New Meeting Scheduled - Kairaa Academy",
          template: "notification.ejs",
          data: { user: { name: student.name }, title: "New Meeting Scheduled", message, dashboardUrl: process.env.CLIENT_URL }
        }).catch(err => console.error("Failed to send meeting email:", err));
      }
    }

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get staff meetings
export const getMeetings = CatchAsyncError(async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ staffId: req.user._id }).populate("courseId", "name");
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

import cloudinary from "cloudinary";

// Upload meeting recording and materials
export const uploadMeetingRecording = CatchAsyncError(async (req, res, next) => {
  try {
    const { meetingId, recordingUrl, materials, materialFile, materialName } = req.body;
    
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return next(new ErrorHandler("Meeting not found", 404));
    }

    if (meeting.staffId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to update this meeting", 403));
    }

    if (recordingUrl) meeting.recordingUrl = recordingUrl;
    
    // Support direct array passing or file upload
    if (materials && Array.isArray(materials)) {
      meeting.materials = materials;
    }

    if (materialFile) {
      const myCloud = await cloudinary.v2.uploader.upload(materialFile, {
        folder: "materials",
        resource_type: "auto",
      });
      meeting.materials.push({
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
        name: materialName || "Materials PDF",
      });
    }
    
    meeting.status = "completed"; // Mark as completed when recording is uploaded
    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Recording uploaded successfully",
      meeting,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- DOUBT CENTER ---

// Get doubts for staff
export const getStaffDoubts = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    // For MVP, just get all doubts assigned to this staff
    // In future, you might want to get all doubts for courses this staff teaches
    const doubts = await Doubt.find({ staffId })
      .populate("studentId", "name email avatar")
      .populate("courseId", "name")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, doubts });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reply to doubt
export const replyToDoubt = CatchAsyncError(async (req, res, next) => {
  try {
    const { doubtId, message, attachment } = req.body;
    
    if (!message) {
      return next(new ErrorHandler("Message is required", 400));
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return next(new ErrorHandler("Doubt not found", 404));
    }

    doubt.replies.push({
      sender: "staff",
      message,
      attachment,
    });

    await doubt.save();

    // Notify student
    const student = await User.findById(doubt.studentId);
    if (student) {
      const Notification = (await import("../models/notificationModel.js")).default;
      const sendMail = (await import("../utils/sendMail.js")).default;
      
      const notificationMessage = `A staff member has replied to your doubt regarding '${doubt.title}'.`;
      
      await Notification.create({
        userId: student._id,
        type: "doubt",
        title: "Doubt Replied",
        message: notificationMessage
      });

      if (student.email) {
        sendMail({
          email: student.email,
          subject: "Doubt Replied - Kairaa Academy",
          template: "notification.ejs",
          data: { user: { name: student.name }, title: "Doubt Replied", message: notificationMessage, dashboardUrl: process.env.CLIENT_URL }
        }).catch(err => console.error("Failed to send doubt reply email:", err));
      }
    }

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      doubt,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Resolve doubt
export const resolveDoubt = CatchAsyncError(async (req, res, next) => {
  try {
    const { doubtId } = req.params;
    
    const doubt = await Doubt.findByIdAndUpdate(
      doubtId,
      { status: "resolved" },
      { new: true }
    );

    if (!doubt) return next(new ErrorHandler("Doubt not found", 404));

    res.status(200).json({
      success: true,
      message: "Doubt resolved",
      doubt,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// --- ASSIGNMENTS ---

// Get pending assignments
export const getStaffAssignments = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const staff = await User.findById(staffId);
    
    console.log("=== DEBUG: getStaffAssignments ===");
    console.log("Logged in Staff ID:", staffId);
    console.log("Assigned Course IDs:", staff.assignedCourses);

    if (!staff.assignedCourses || staff.assignedCourses.length === 0) {
      console.log("No assigned courses found for staff.");
      return res.status(200).json({ success: true, assignments: [] });
    }

    const assignedCourseIds = staff.assignedCourses.map(id => id.toString());
    console.log("Parsed Assigned Course IDs:", assignedCourseIds);

    // Get strictly assigned students for this staff
    const orders = await Order.find({ assignedStaffId: staffId }).lean();
    const assignedStudentIds = orders.map(o => o.userId).filter(Boolean);

    const assignments = await Assignment.find({ 
      courseId: { $in: assignedCourseIds },
      studentId: { $in: assignedStudentIds }
    })
      .populate("studentId", "name email avatar")
      .populate("courseId", "name")
      .sort({ createdAt: -1 });

    const assignmentCourseIds = assignments.map(a => a.courseId?._id?.toString());
    console.log("Assignment Course IDs:", assignmentCourseIds);

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Review assignment
export const reviewAssignment = CatchAsyncError(async (req, res, next) => {
  try {
    const { assignmentId, marks, feedback, status } = req.body;
    
    if (!status || !["approved", "rejected"].includes(status)) {
      return next(new ErrorHandler("Valid status (approved/rejected) is required", 400));
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return next(new ErrorHandler("Assignment not found", 404));
    }

    const staff = await User.findById(req.user._id);
    const isAssigned = staff.assignedCourses.some(id => id.toString() === assignment.courseId.toString());
    if (!isAssigned) {
      return next(new ErrorHandler("Unauthorized: You are not assigned to this course.", 403));
    }

    assignment.status = status;
    assignment.marks = marks;
    assignment.feedback = feedback;
    await assignment.save();

    // Notify student
    const student = await User.findById(assignment.studentId);
    if (student) {
      const Notification = (await import("../models/notificationModel.js")).default;
      const sendMail = (await import("../utils/sendMail.js")).default;
      
      const notificationMessage = `Your assignment '${assignment.assignmentTitle}' has been reviewed. Status: ${status}.`;
      
      await Notification.create({
        userId: student._id,
        type: "assignment",
        title: "Assignment Reviewed",
        message: notificationMessage
      });

      if (student.email) {
        sendMail({
          email: student.email,
          subject: "Assignment Reviewed - Kairaa Academy",
          template: "notification.ejs",
          data: { user: { name: student.name }, title: "Assignment Reviewed", message: notificationMessage, dashboardUrl: process.env.CLIENT_URL }
        }).catch(err => console.error("Failed to send review email:", err));
      }
    }

    res.status(200).json({
      success: true,
      message: "Assignment reviewed successfully",
      assignment,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Create Assignment Task
export const createAssignmentTask = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const { courseId, batchId, title, description, dueDate } = req.body;

    if (!courseId || !title || !description || !dueDate) {
      return next(new ErrorHandler("Please provide courseId, title, description, and dueDate", 400));
    }

    const staff = await User.findById(staffId);
    const isAssigned = staff.assignedCourses.some(id => id.toString() === courseId.toString());
    if (!isAssigned) {
      return next(new ErrorHandler("Unauthorized: You are not assigned to this course.", 403));
    }

    const task = await AssignmentTask.create({
      staffId,
      courseId,
      batchId: batchId || null,
      title,
      description,
      dueDate
    });

    // Notify targeted students
    const Notification = (await import("../models/notificationModel.js")).default;
    const sendMail = (await import("../utils/sendMail.js")).default;
    let targetStudents = [];

    if (batchId) {
      const Batch = (await import("../models/batchModel.js")).default;
      const batch = await Batch.findById(batchId).populate("students", "name email");
      if (batch) targetStudents = batch.students;
    } else {
      const orders = await Order.find({ assignedStaffId: staffId, courseId }).populate("userId", "name email");
      targetStudents = orders.map(o => o.userId).filter(u => u != null);
    }

    const message = `A new assignment '${title}' has been posted. Due date: ${new Date(dueDate).toLocaleDateString()}.`;

    for (const student of targetStudents) {
      await Notification.create({
        userId: student._id,
        type: "assignment",
        title: "New Assignment Posted",
        message
      });

      if (student.email) {
        sendMail({
          email: student.email,
          subject: "New Assignment - Kairaa Academy",
          template: "notification.ejs",
          data: { user: { name: student.name }, title: "New Assignment Posted", message, dashboardUrl: process.env.CLIENT_URL }
        }).catch(err => console.error("Failed to send assignment email:", err));
      }
    }

    res.status(201).json({
      success: true,
      message: "Assignment task created successfully",
      task,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Assignment Tasks created by this staff
export const getStaffAssignmentTasks = CatchAsyncError(async (req, res, next) => {
  try {
    const staff = await User.findById(req.user._id);
    if (!staff.assignedCourses || staff.assignedCourses.length === 0) {
      return res.status(200).json({ success: true, tasks: [] });
    }
    const tasks = await AssignmentTask.find({ courseId: { $in: staff.assignedCourses } }).populate("courseId", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Assigned Courses
export const getStaffAssignedCourses = CatchAsyncError(async (req, res, next) => {
  try {
    console.log("=== DEBUG: getStaffAssignedCourses ===");
    console.log("Logged in Staff ID:", req.user._id);
    const staff = await User.findById(req.user._id).populate("assignedCourses", "_id name");
    console.log("Dropdown Course IDs:", staff.assignedCourses.map(c => c._id?.toString()));
    res.status(200).json({ success: true, assignedCourses: staff.assignedCourses || [] });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- ATTENDANCE DASHBOARD ---

export const getAttendanceDashboard = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;

    // 1. Get all meetings created by this staff member
    const allMeetings = await Meeting.find({ staffId }).populate("courseId", "name");
    
    // Get today's meetings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysMeetings = await Meeting.find({ 
      staffId, 
      date: { $gte: today, $lt: tomorrow } 
    }).populate("courseId", "name");

    // Get all students assigned to this staff
    const orders = await Order.find({ assignedStaffId: staffId }).populate("userId", "name email");
    const assignedStudents = orders.map(o => o.userId);

    // Get attendance records for all these meetings
    const meetingIds = allMeetings.map(m => m._id);
    const attendanceRecords = await Attendance.find({ meetingId: { $in: meetingIds } })
                                              .populate("studentId", "name email avatar");

    // We can calculate overall attendance rate: (Total Present / (Total Assigned Students * Total Meetings)) * 100
    // But realistically, only enrolled students for specific courses count towards that course's meetings.
    let totalExpectedAttendances = 0;
    let totalPresent = 0;

    for (let meeting of allMeetings) {
      // Find students enrolled in this meeting's course and assigned to this staff
      const enrolledInCourse = orders.filter(o => String(o.courseId) === String(meeting.courseId));
      totalExpectedAttendances += enrolledInCourse.length;

      // Count presents for this meeting
      const present = attendanceRecords.filter(a => String(a.meetingId) === String(meeting._id) && a.status === "present");
      totalPresent += present.length;
    }

    const overallRate = totalExpectedAttendances === 0 ? 0 : Math.round((totalPresent / totalExpectedAttendances) * 100);

    // Build today's sessions payload with attendance info
    const todaysSessionsPayload = todaysMeetings.map(meeting => {
      // Who should be there?
      const enrolledInCourse = orders.filter(o => String(o.courseId) === String(meeting.courseId)).map(o => o.userId);
      const recordsForMeeting = attendanceRecords.filter(a => String(a.meetingId) === String(meeting._id));
      
      const presentStudents = recordsForMeeting.filter(a => a.status === "present").map(a => String(a.studentId._id));
      
      const absentStudentsList = enrolledInCourse.filter(student => !presentStudents.includes(String(student._id)));
      const presentStudentsList = enrolledInCourse.filter(student => presentStudents.includes(String(student._id)));

      return {
        meeting,
        presentCount: presentStudentsList.length,
        absentCount: absentStudentsList.length,
        absentStudents: absentStudentsList,
        presentStudents: presentStudentsList
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSessions: allMeetings.length,
        overallRate,
      },
      todaysSessions: todaysSessionsPayload
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const sendAttendanceReminder = CatchAsyncError(async (req, res, next) => {
  try {
    const { studentId, message } = req.body;

    if (!studentId || !message) {
      return next(new ErrorHandler("Please provide studentId and message", 400));
    }

    await Notification.create({
      userId: studentId,
      title: "Attendance Reminder",
      message,
    });

    res.status(200).json({ success: true, message: "Reminder sent successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- ALL SESSIONS WITH ATTENDANCE (History + Filtering) ---

export const getAllSessionsWithAttendance = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const { courseId } = req.query;

    // Get all meetings by this staff, optionally filtered by course
    const meetingFilter = { staffId };
    if (courseId) meetingFilter.courseId = courseId;

    const allMeetings = await Meeting.find(meetingFilter)
      .populate("courseId", "name")
      .sort({ date: -1 });

    // Get all orders (enrolled students) for this staff
    const orders = await Order.find({ assignedStaffId: staffId });
    const userIds = [...new Set(orders.map((o) => o.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }, "name email avatar");
    const userMap = new Map();
    users.forEach((u) => userMap.set(String(u._id), u));

    // Get all attendance records for these meetings
    const meetingIds = allMeetings.map((m) => m._id);
    const attendanceRecords = await Attendance.find({ meetingId: { $in: meetingIds } })
      .populate("studentId", "name email avatar");

    const sessionsPayload = allMeetings.map((meeting) => {
      // Students enrolled in this meeting's course and assigned to this staff
      const enrolledInCourse = orders
        .filter((o) => String(o.courseId) === String(meeting.courseId?._id || meeting.courseId))
        .map((o) => userMap.get(String(o.userId)))
        .filter(Boolean);

      const recordsForMeeting = attendanceRecords.filter(
        (a) => String(a.meetingId) === String(meeting._id)
      );

      const presentStudentIds = recordsForMeeting
        .filter((a) => a.status === "present" || a.status === "late")
        .map((a) => String(a.studentId?._id || a.studentId));

      const presentStudents = enrolledInCourse.filter((s) =>
        presentStudentIds.includes(String(s._id))
      );
      const absentStudents = enrolledInCourse.filter(
        (s) => !presentStudentIds.includes(String(s._id))
      );

      // Map records for status detail (present/late)
      const studentStatusMap = {};
      recordsForMeeting.forEach((a) => {
        studentStatusMap[String(a.studentId?._id || a.studentId)] = a.status;
      });

      return {
        meeting,
        presentCount: presentStudents.length,
        absentCount: absentStudents.length,
        totalCount: enrolledInCourse.length,
        presentStudents: presentStudents.map((s) => ({
          ...s.toObject(),
          attendanceStatus: studentStatusMap[String(s._id)] || "present",
        })),
        absentStudents,
      };
    });

    res.status(200).json({
      success: true,
      sessions: sessionsPayload,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- PER-STUDENT ATTENDANCE STATS ---

export const getStudentAttendanceStats = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;

    // Get all meetings by this staff
    const allMeetings = await Meeting.find({ staffId });
    const meetingIds = allMeetings.map((m) => m._id);

    // Get enrolled students (all unique students across all assigned courses)
    const orders = await Order.find({ assignedStaffId: staffId });
    const userIds = [...new Set(orders.map((o) => o.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }, "name email avatar");
    const userMap = new Map();
    users.forEach((u) => userMap.set(String(u._id), u));

    // Deduplicate students (a student may be in multiple courses)
    const studentMap = new Map();
    for (const order of orders) {
      if (!order.userId) continue;
      const user = userMap.get(String(order.userId));
      if (!user) continue;

      const sid = String(user._id);
      if (!studentMap.has(sid)) {
        studentMap.set(sid, {
          student: user,
          courseIds: [String(order.courseId)],
        });
      } else {
        studentMap.get(sid).courseIds.push(String(order.courseId));
      }
    }

    // Get all attendance records for these meetings
    const attendanceRecords = await Attendance.find({ meetingId: { $in: meetingIds } });

    const statsPayload = [];

    for (const [sid, { student, courseIds }] of studentMap) {
      // Meetings relevant to this student (meetings for their enrolled courses)
      const relevantMeetings = allMeetings.filter((m) =>
        courseIds.includes(String(m.courseId))
      );
      const totalSessions = relevantMeetings.length;

      // Count attended (present or late)
      const attended = attendanceRecords.filter(
        (a) =>
          String(a.studentId) === sid &&
          relevantMeetings.some((m) => String(m._id) === String(a.meetingId)) &&
          (a.status === "present" || a.status === "late")
      ).length;

      const rate = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;

      let riskStatus = "on-track";
      if (rate < 50) riskStatus = "critical";
      else if (rate < 75) riskStatus = "at-risk";

      statsPayload.push({
        student,
        attended,
        totalSessions,
        rate,
        riskStatus,
      });
    }

    // Sort: critical first, then at-risk, then on-track
    const order = { critical: 0, "at-risk": 1, "on-track": 2 };
    statsPayload.sort((a, b) => order[a.riskStatus] - order[b.riskStatus]);

    res.status(200).json({ success: true, stats: statsPayload });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- MANUAL ATTENDANCE MARK BY STAFF ---

export const markAttendanceManually = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const { meetingId, studentId, courseId, status } = req.body;

    if (!meetingId || !studentId || !courseId || !status) {
      return next(
        new ErrorHandler("meetingId, studentId, courseId and status are required", 400)
      );
    }

    if (!["present", "absent", "late"].includes(status)) {
      return next(new ErrorHandler("Status must be present, absent, or late", 400));
    }

    // Verify the meeting belongs to this staff
    const meeting = await Meeting.findOne({ _id: meetingId, staffId });
    if (!meeting) {
      return next(new ErrorHandler("Meeting not found or unauthorized", 404));
    }

    let attendance;
    if (status === "absent") {
      // Remove attendance record if marking absent (or ensure it's absent)
      attendance = await Attendance.findOneAndUpdate(
        { meetingId, studentId },
        { courseId, status: "absent", joinTime: null },
        { new: true, upsert: true }
      );
    } else {
      attendance = await Attendance.findOneAndUpdate(
        { meetingId, studentId },
        { courseId, joinTime: new Date(), status },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status}`,
      attendance,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- CERTIFICATES ---

// Recommend student for a certificate
export const recommendCertificate = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const { studentId, courseId, notes } = req.body;

    if (!studentId || !courseId) {
      return next(new ErrorHandler("Please provide studentId and courseId", 400));
    }

    // Check if already recommended
    const existing = await CertificateRecommendation.findOne({ studentId, courseId });
    if (existing) {
      return next(new ErrorHandler("Recommendation already exists for this student and course", 400));
    }

    // ENFORCE 75% ATTENDANCE RULE
    // Find if student is in a batch for this course
    const batch = await Batch.findOne({ courseId, students: studentId });
    const batchId = batch ? batch._id : null;

    // Fetch meetings this student had access to (global + their specific batch)
    const allMeetings = await Meeting.find({ 
      courseId,
      $or: [{ batchId: null }, { batchId }] 
    });
    // Total meetings that happened so far
    const pastMeetings = allMeetings.filter(m => m.date < new Date());
    
    if (pastMeetings.length > 0) {
      const attendanceRecords = await Attendance.find({ 
        studentId, 
        courseId, 
        status: "present" 
      });

      const attendancePercentage = (attendanceRecords.length / pastMeetings.length) * 100;
      
      if (attendancePercentage < 75) {
        return next(new ErrorHandler(`Student only has ${attendancePercentage.toFixed(1)}% attendance. Minimum 75% required.`, 400));
      }
    }

    const recommendation = await CertificateRecommendation.create({
      staffId,
      studentId,
      courseId,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Student recommended for certificate successfully",
      recommendation,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ==================== PROJECT FUNCTIONS ====================
export const createProjectTask = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, batchId, title, description, dueDate } = req.body;
    const staffId = req.user?._id;

    const task = await ProjectTask.create({
      staffId,
      courseId,
      batchId,
      title,
      description,
      dueDate,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getStaffProjects = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user?._id;
    // Get all projects for tasks assigned by this staff
    const projects = await Project.find({ staffId })
      .populate('studentId', 'name avatar email')
      .populate('courseId', 'name')
      .populate('projectTaskId', 'title')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const staffReviewProject = CatchAsyncError(async (req, res, next) => {
  try {
    const { projectId, status, marks, message } = req.body;
    const staffId = req.user?._id;

    const project = await Project.findOne({ _id: projectId, staffId });
    if (!project) return next(new ErrorHandler("Project not found or unauthorized", 404));

    if (status) project.status = status;
    if (marks) project.marks = marks;

    if (message) {
      project.replies.push({
        sender: 'staff',
        message,
      });
    }

    await project.save();

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
