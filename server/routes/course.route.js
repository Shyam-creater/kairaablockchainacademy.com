import express from "express";
import { editCourse, getAllCourses, getSingleCourse, uploadCourse,getCourseByUser, addQuestion, addAnswer, generateVideoUrl, addReview, addReplyToReview, getAdminAllCourse, deleteCourse } from "../controllers/course.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
// import {  } from "../controllers/user.controller.js";

const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated,authorizeRoles("admin"),uploadCourse);
courseRouter.put("/edit-course/:id",isAuthenticated,authorizeRoles("admin"), editCourse);
courseRouter.get("/get-course/:id",getSingleCourse);
courseRouter.get("/get-all-courses", getAllCourses);
courseRouter.get("/get-course-content/:id",isAuthenticated,getCourseByUser);
courseRouter.put("/add-question", isAuthenticated,addQuestion);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put("/add-reply", isAuthenticated,authorizeRoles("admin"), addReplyToReview);
courseRouter.get("/get-admin-courses", isAuthenticated,authorizeRoles("admin"), getAdminAllCourse);
courseRouter.delete("/delete-course/:id", isAuthenticated,authorizeRoles("admin"), deleteCourse);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);
export default courseRouter;
