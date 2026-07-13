import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { saveResumeProgress, getResumeProgress } from "../controllers/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.post("/resume/save", isAuthenticated, saveResumeProgress);
resumeRouter.get("/resume/:courseId", isAuthenticated, getResumeProgress);

export default resumeRouter;
