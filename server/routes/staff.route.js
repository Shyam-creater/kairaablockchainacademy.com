import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { 
  getAssignedStudents, scheduleMeeting, getMeetings, uploadMeetingRecording,
  getStaffDoubts, replyToDoubt, resolveDoubt,
  getStaffAssignments, reviewAssignment,
  getStudentsProgress, recommendCertificate,
  createAssignmentTask, getStaffAssignmentTasks, getStaffAssignedCourses,
  getAttendanceDashboard, sendAttendanceReminder,
  getAllSessionsWithAttendance, getStudentAttendanceStats, markAttendanceManually,
  getStaffBatches,
  createProjectTask, getStaffProjects, staffReviewProject,
} from "../controllers/staff.controller.js";

const staffRouter = express.Router();

staffRouter.get(
  "/assigned-courses",
  isAuthenticated,
  authorizeRoles("staff", "admin"),
  getStaffAssignedCourses
);


staffRouter.get(
  "/assigned-students",
  isAuthenticated,
  authorizeRoles("staff", "admin"),
  getAssignedStudents
);

staffRouter.post("/meetings", isAuthenticated, authorizeRoles("staff"), scheduleMeeting);
staffRouter.get("/meetings", isAuthenticated, authorizeRoles("staff"), getMeetings);
staffRouter.put("/meetings/upload-recording", isAuthenticated, authorizeRoles("staff"), uploadMeetingRecording);

// Doubts
staffRouter.get(
  "/doubts",
  isAuthenticated,
  authorizeRoles("staff", "admin"),
  getStaffDoubts
);
staffRouter.put(
  "/doubts/reply",
  isAuthenticated,
  authorizeRoles("staff", "admin"),
  replyToDoubt
);
staffRouter.put(
  "/doubts/:doubtId/resolve",
  isAuthenticated,
  authorizeRoles("staff", "admin"),
  resolveDoubt
);

// Assignments
staffRouter.get("/assignments", isAuthenticated, authorizeRoles("staff"), getStaffAssignments);
staffRouter.get("/assigned-students", isAuthenticated, authorizeRoles("staff"), getAssignedStudents);
staffRouter.get("/batches", isAuthenticated, authorizeRoles("staff"), getStaffBatches);
staffRouter.put("/assignments/review", isAuthenticated, authorizeRoles("staff"), reviewAssignment);

// Assignment Tasks
staffRouter.post("/assignment-task", isAuthenticated, authorizeRoles("staff"), createAssignmentTask);
staffRouter.get("/assignment-task", isAuthenticated, authorizeRoles("staff"), getStaffAssignmentTasks);

// Attendance
staffRouter.get("/attendance-dashboard", isAuthenticated, authorizeRoles("staff"), getAttendanceDashboard);
staffRouter.post("/attendance-reminder", isAuthenticated, authorizeRoles("staff"), sendAttendanceReminder);
staffRouter.get("/all-sessions", isAuthenticated, authorizeRoles("staff"), getAllSessionsWithAttendance);
staffRouter.get("/student-attendance-stats", isAuthenticated, authorizeRoles("staff"), getStudentAttendanceStats);
staffRouter.put("/mark-attendance", isAuthenticated, authorizeRoles("staff"), markAttendanceManually);

// Progress & Certificates
staffRouter.get("/students-progress", isAuthenticated, authorizeRoles("staff"), getStudentsProgress);
staffRouter.post("/recommend-certificate", isAuthenticated, authorizeRoles("staff"), recommendCertificate);


// Projects
staffRouter.post("/project-task", isAuthenticated, authorizeRoles("staff"), createProjectTask);
staffRouter.get("/projects", isAuthenticated, authorizeRoles("staff"), getStaffProjects);
staffRouter.put("/projects/review", isAuthenticated, authorizeRoles("staff"), staffReviewProject);

export default staffRouter;
