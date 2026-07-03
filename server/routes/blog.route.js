import express from "express";
import {
  createBlog,
  getAllBlogs,
  editBlog,
  deleteBlog,
  updateBlogStatus,
  getBlogAnalytics
} from "../controllers/blog.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const blogRoute = express.Router();

// Public — anyone can read blogs
blogRoute.get("/get-all-blogs", getAllBlogs);

// Analytics
blogRoute.get(
  "/blog-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getBlogAnalytics
);

// Admin only
blogRoute.post(
  "/create-blog",
  isAuthenticated,
  authorizeRoles("admin"),
  createBlog
);

blogRoute.put(
  "/edit-blog/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editBlog
);

blogRoute.patch(
  "/blog-status/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateBlogStatus
);

blogRoute.delete(
  "/delete-blog/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlog
);

export default blogRoute;
