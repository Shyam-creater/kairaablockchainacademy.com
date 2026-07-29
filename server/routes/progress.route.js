import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { saveProgress, markLessonWatched, getCourseProgress } from "../controllers/progress.controller.js";

const progressRouter = express.Router();

progressRouter.post("/progress/save", isAuthenticated, saveProgress);
progressRouter.post("/progress/mark", isAuthenticated, markLessonWatched);
progressRouter.get("/progress/:courseId", isAuthenticated, getCourseProgress);

export default progressRouter;
