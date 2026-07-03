import express from "express";
import { editCourse, getAllCourses, getSingleCourse, uploadCourse,getCourseByUser, addQuestion, addAnswer, generateVideoUrl, addReview, addReplyToReview, getAdminAllCourse, deleteCourse, addLiveSession, updateLiveSession, deleteLiveSession } from "../controllers/course.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
// import {  } from "../controllers/user.controller.js";

const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated,authorizeRoles("admin", "staff"),uploadCourse);
courseRouter.put("/edit-course/:id",isAuthenticated,authorizeRoles("admin", "staff"), editCourse);
courseRouter.get("/get-course/:id",getSingleCourse);
courseRouter.get("/get-all-courses", getAllCourses);
courseRouter.get("/get-course-content/:id",isAuthenticated,getCourseByUser);
courseRouter.put("/add-question", isAuthenticated,addQuestion);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put("/add-reply", isAuthenticated,authorizeRoles("admin", "staff"), addReplyToReview);
courseRouter.get("/get-admin-courses", isAuthenticated,authorizeRoles("admin", "staff"), getAdminAllCourse);
courseRouter.delete("/delete-course/:id", isAuthenticated,authorizeRoles("admin", "staff"), deleteCourse);

// Live Sessions
courseRouter.post("/add-live-session/:courseId", isAuthenticated, authorizeRoles("admin", "staff"), addLiveSession);
courseRouter.put("/update-live-session/:courseId/:sessionId", isAuthenticated, authorizeRoles("admin", "staff"), updateLiveSession);
courseRouter.delete("/delete-live-session/:courseId/:sessionId", isAuthenticated, authorizeRoles("admin", "staff"), deleteLiveSession);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);
export default courseRouter;
