import ShowcaseProject from "../models/showcaseProjectModel.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import { createCourse } from "../services/course.service.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import Course from "../models/courseModel.js";
import { redis } from "../utils/redis.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import ejs from "ejs";
import axios from "axios";
import Notification from "../models/notificationModel.js";
import { getAllCoursesService } from "../services/course.service.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// create course
export const uploadCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    // console.log("Received data:", data);




    const thumbnail = data.thumbnail;

    
    if (thumbnail) {
      console.log("Uploading thumbnail to Cloudinary");
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      console.log("Thumbnail uploaded:", data.thumbnail);
    }
    
    // Assign the course to the current user (staff or admin)
    data.instructorId = req.user._id;

    // Auto-calculate stats
    if (data.courseContentData && Array.isArray(data.courseContentData)) {
        data.totalVideos = data.courseContentData.length;
        data.lessonsCount = data.courseContentData.length;
        const sections = new Set(data.courseContentData.map(c => c.videoSection).filter(Boolean));
        data.modulesCount = sections.size;
    }

    if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }

    // console.log("Creating course with data:", data);
    createCourse(data, res, next);
  } catch (error) {
    console.error("Error in uploadCourse:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// edit course
export const editCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;

    const courseId=req.params.id;
    const courseData= await Course.findById(courseId);

    if (!courseData) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Check ownership
    if (req.user.role !== "admin" && courseData.instructorId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to edit this course", 403));
    }

    if (thumbnail && !thumbnail.startsWith("https")) {
      await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    if(thumbnail.startsWith("https")){
      data.thumbnail={
        public_id: courseData?.thumbnail.public_id,
        url:courseData?.thumbnail.url
      }
    }
   
    if (data.courseContentData && Array.isArray(data.courseContentData)) {
        data.totalVideos = data.courseContentData.length;
        data.lessonsCount = data.courseContentData.length;
        const sections = new Set(data.courseContentData.map(c => c.videoSection).filter(Boolean));
        data.modulesCount = sections.size;
    }

    if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );
    await redis.set(courseId, JSON.stringify(course)); 
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log('jhdytfghgh', error)
    return next(new ErrorHandler(error.message, 500));
  }
});



// get single course-- without purchasing
export const getSingleCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const isCacheExist = await redis.get(courseId);
    if (isCacheExist) {
      const course = JSON.parse(isCacheExist);
      console.log("hitting redis");
      res.status(200).json({
        success: true,
        course,
      });
    } else {
      const course = await Course.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
      console.log("hitting mongodb");
      await redis.set(courseId, JSON.stringify(course),"Ex",604800);
      res.status(200).json({
        success: true,
        course,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all course

export const getAllCourses = CatchAsyncError(async (req, res, next) => {
  try {
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get course content - only for valid users

export const getCourseByUser = CatchAsyncError(async (req, res, next) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList.find(
      (course) => course._id.toString() === courseId
    );

    if (!courseExists) {
      return next(
        new ErrorHandler("you are not eligible to access this course", 400)
      );
    }

    const course = await Course.findById(courseId);
    const content = course?.courseContentData;
    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    return next(new ErrorHandler(error.mesage, 400));
  }
});

// add questions in course


export const addQuestion = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { question, courseId, contentId }= req.body;
      const course = await Course.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      const couseContent = course?.courseContentData?.find((item) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object
      const newQuestion = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      couseContent.questions.push(newQuestion);

      await Notification.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${couseContent.title}`,
      });

      // save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course question
export const addAnswer = CatchAsyncError(async (req, res, next) => {
  try {
    const { answer, courseId, contentId, questionId } = req.body;
    const course = await Course.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler("Invalid course Id", 400));
    }

    const courseContent = course?.courseContentData?.find((item) =>
      item._id.equals(contentId)
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 400));
    }
    const question = courseContent?.questions?.find((item) =>
      item._id.equals(questionId)
    );

    if (!question) {
      return next(new ErrorHandler("Invalid question id", 400));
    }
    const newAnswer = {
      user: req.user,
      answer,
    };

    // add the answer to the course content
    question.questionReplies.push(newAnswer);
    await course.save();

    if (req.user?._id === question.user._id) {
      // create a notification
      await Notification.create({
        user: req.user._id,
        title: "New question reply received",
        message: `You have a new question reply in ${courseContent.title}`,
      });
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title,
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/question-reply.ejs"),
        data
      );
      try {
        await sendMail({
          email: question.user.email,
          subject: "Question Reply",
          template: "question-reply.ejs",
          data,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// add review in course
export const addReview = CatchAsyncError(async (req, res, next) => {
  try {
    const userCourseList = req.user?.courses;
    console.log(`userCourse ${userCourseList}`);
    const courseId = req.params.id;

    // check if courseId already exists in userCourseList
    const courseExists = userCourseList?.some(
      (course) => course._id.toString() === courseId.toString()
    );
    if (!courseExists) {
      return next(
        new ErrorHandler("you are not eligible to access this course", 400)
      );
    }

    const course = await Course.findById(courseId);
    const { review, rating } = req.body;

    const reviewData = {
      user: req.user,
      comment: review,
      rating,
    };
    course?.reviews.push(reviewData);

    let avg = 0;

    course?.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    if (course) {
      course.averageRating = avg / course.reviews.length;
    }
    await course?.save();
    const notification = {
      title: "New Review Received",
      message: `${req.user?.name} has given a review in our ${course?.title} `,
    };
    // create notification

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// add reply to review
export const addReplyToReview = CatchAsyncError(async (req, res, next) => {
  const { courseId, reviewId, comment } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorHandler("Course not found", 400));
  }

  // Check if user is authorized to reply (must be admin or the course instructor)
  if (req.user.role !== "admin" && course.instructorId?.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to reply to reviews for this course", 403));
  }

  const review = course?.reviews?.find(
    (rev) => rev._id.toString() === reviewId.toString()
  );

  if (!review) {
    return next(new ErrorHandler("Review doesn't exist", 400));
  }

  const replyData = {
    user: req.user,
    comment,
  };

  if (!review.commentReplies) {
    review.commentReplies = [];
  }

  review.commentReplies?.push(replyData);

  await course?.save();
  res.status(201).json({
    success: true,
    course,
  });
});

// generate video url
export const generateVideoUrl = CatchAsyncError(async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Apisecret ${process.env.VIDEOCIPHER_API_SECRET}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log("axipogfjnbg" , error.message)
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all courses --- only for admins/staff
export const getAdminAllCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { instructorId: req.user._id };
    const courses = await Course.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// delete course -- only for admins

export const deleteCourse= CatchAsyncError(async(req,res,next)=>{
  try{
const {id}= req.params;
const course= await Course.findById(id);
if(!course){
  return next(new ErrorHandler("Course not found",404))
}

// Check ownership
if (req.user.role !== "admin" && course.instructorId.toString() !== req.user._id.toString()) {
  return next(new ErrorHandler("You are not authorized to delete this course", 403));
}

await course.deleteOne({id});
await redis.del(id);
res.status(200).json({
  success:true,
  message:"Course deleted successfully"
})
  }catch(error){
    return next(new ErrorHandler(error.message, 500))
  }
})

// add live session to course
export const addLiveSession = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description, scheduledAt, meetingUrl, maxParticipants } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (req.user.role !== "admin" && course.instructorId?.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to add a live session to this course", 403));
    }

    const newSession = {
      title,
      description,
      scheduledAt,
      meetingUrl,
      maxParticipants,
    };

    course.liveSessions.push(newSession);
    await course.save();

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update live session
export const updateLiveSession = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, sessionId } = req.params;
    const data = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (req.user.role !== "admin" && course.instructorId?.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to update a live session in this course", 403));
    }

    const session = course.liveSessions.find(s => s._id.toString() === sessionId);
    if (!session) {
      return next(new ErrorHandler("Live session not found", 404));
    }

    Object.assign(session, data);
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete live session
export const deleteLiveSession = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, sessionId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (req.user.role !== "admin" && course.instructorId?.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to delete a live session in this course", 403));
    }

    course.liveSessions = course.liveSessions.filter(s => s._id.toString() !== sessionId);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Live session deleted successfully"
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

import Project from "../models/projectModel.js";


// Get all public showcase projects (Without authentication)
export const getPublicProjects = CatchAsyncError(async (req, res, next) => {
    try {
        const projects = await ShowcaseProject.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
