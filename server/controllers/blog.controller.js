import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import Blog from "../models/blogModel.js";
import cloudinary from "cloudinary";

// ── Create Blog ──────────────────────────────────────────────────────────────
export const createBlog = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const image = data.image;

    if (image && image.startsWith("data:")) {
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "blogs",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else if (!image || image === "") {
      delete data.image;
    }

    if (req.user) {
      data.createdBy = req.user.name || req.user.email || "";
    }

    const blog = await Blog.create(data);

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("createBlog error:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// ── Get All Blogs ─────────────────────────────────────────────────────────────
export const getAllBlogs = CatchAsyncError(async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ── Edit Blog ─────────────────────────────────────────────────────────────────
export const editBlog = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const image = data.image;

    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    // If a new base64 image is sent, upload to Cloudinary and replace old one
    if (image && image.startsWith("data:")) {
      // Delete old image from Cloudinary if exists
      if (blog.image?.public_id) {
        await cloudinary.v2.uploader.destroy(blog.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "blogs",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else if (!image || image === "") {
      // Keep the existing image unchanged
      delete data.image;
    }
    // If image is already a URL (not base64), keep as-is — do not re-upload

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    res.status(200).json({
      success: true,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("editBlog error:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// ── Delete Blog ───────────────────────────────────────────────────────────────
export const deleteBlog = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    // Delete image from Cloudinary
    if (blog.image?.public_id) {
      await cloudinary.v2.uploader.destroy(blog.image.public_id);
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ── Update Blog Status ─────────────────────────────────────────────────────────
export const updateBlogStatus = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["Draft", "Published", "Archived"].includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }

    const blog = await Blog.findByIdAndUpdate(id, { status }, { new: true });
    if (!blog) return next(new ErrorHandler("Blog not found", 404));

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ── Get Blog Analytics ─────────────────────────────────────────────────────────
export const getBlogAnalytics = CatchAsyncError(async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    
    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.status === "Published").length;
    
    const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = blogs.reduce((acc, curr) => acc + (curr.likes || 0), 0);

    // Top 5 blogs by views
    const topBlogs = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    res.status(200).json({
      success: true,
      analytics: {
        totalBlogs,
        publishedBlogs,
        totalViews,
        totalLikes,
        topBlogs
      }
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
