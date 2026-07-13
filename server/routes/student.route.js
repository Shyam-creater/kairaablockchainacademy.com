import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { 
  createDoubt, 
  getStudentDoubts, 
  studentReplyDoubt, 
  submitAssignment, 
  getStudentAssignments,
  getCourseAssignmentTasks,
  submitProject,
  getStudentProjects,
  getCourseProjectTasks,
  studentReplyProject,

  getStudentMeetings,
  markAttendance,
  getDashboardMetrics,
  getCoursesProgressSummary
} from "../controllers/student.controller.js";

const studentRouter = express.Router();

// Dashboard
studentRouter.get("/dashboard-metrics", isAuthenticated, getDashboardMetrics);
studentRouter.get("/courses-progress-summary", isAuthenticated, getCoursesProgressSummary);

// Doubts
studentRouter.post("/doubts", isAuthenticated, createDoubt);
studentRouter.get("/doubts/:courseId", isAuthenticated, getStudentDoubts);
studentRouter.put("/doubts/reply", isAuthenticated, studentReplyDoubt);

// Assignments
studentRouter.post("/assignments", isAuthenticated, submitAssignment);
studentRouter.get("/assignments/:courseId", isAuthenticated, getStudentAssignments);
studentRouter.get("/assignment-tasks/:courseId", isAuthenticated, getCourseAssignmentTasks);

// Meetings
studentRouter.get("/meetings/:courseId", isAuthenticated, getStudentMeetings);

// Attendance
studentRouter.post("/attendance/mark", isAuthenticated, markAttendance);

// Projects
studentRouter.post("/projects", isAuthenticated, submitProject);
studentRouter.get("/projects/:courseId", isAuthenticated, getStudentProjects);
studentRouter.get("/project-tasks/:courseId", isAuthenticated, getCourseProjectTasks);
studentRouter.put("/projects/reply", isAuthenticated, studentReplyProject);

export default studentRouter;
