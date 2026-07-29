import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { 
  getQuizForSection, 
  submitQuiz, 
  createOrUpdateQuiz, 
  getQuizzesByCourse,
  getQuizAnalytics,
  getQuizLeaderboard,
  getStudentResults,
  getStudentQuizzes
} from "../controllers/quiz.controller.js";

const quizRouter = express.Router();

// ⚠️ Specific routes MUST come before wildcard /:courseId/:sectionName
quizRouter.post("/quiz/submit", isAuthenticated, submitQuiz);
quizRouter.get("/quiz/course/:courseId", isAuthenticated, authorizeRoles("admin", "staff"), getQuizzesByCourse);
quizRouter.post("/quiz/admin/create", isAuthenticated, authorizeRoles("admin", "staff"), createOrUpdateQuiz);
quizRouter.get("/quiz/admin/analytics", isAuthenticated, authorizeRoles("admin", "staff"), getQuizAnalytics);
quizRouter.get("/quiz/admin/leaderboard", isAuthenticated, authorizeRoles("admin", "staff"), getQuizLeaderboard);
quizRouter.get("/quiz/admin/results", isAuthenticated, authorizeRoles("admin", "staff"), getStudentResults);

// Wildcard route LAST — must not conflict with any above
quizRouter.get("/quiz/student/:courseId", isAuthenticated, getStudentQuizzes);
quizRouter.get("/quiz/:courseId/:sectionName", isAuthenticated, getQuizForSection);

export default quizRouter;
