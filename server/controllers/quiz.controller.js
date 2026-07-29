import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Quiz from "../models/quizModel.js";
import QuizAttempt from "../models/quizAttemptModel.js";

// For students to fetch quiz without answers
export const getQuizForSection = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, sectionName } = req.params;

    const quiz = await Quiz.findOne({ courseId, sectionName });
    if (!quiz) {
      return res.status(200).json({ success: true, quiz: null });
    }

    // Hide correct answers
    const safeQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        sectionName: quiz.sectionName,
        passMark: quiz.passMark,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        availableFrom: quiz.availableFrom,
        availableUntil: quiz.availableUntil,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// For students to get all published quizzes and their attempts
export const getStudentQuizzes = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id;

    // Fetch all published quizzes for the course
    const quizzes = await Quiz.find({ courseId, status: "published" });

    // Fetch all attempts by this student for these quizzes
    const quizIds = quizzes.map((q) => q._id);
    const attempts = await QuizAttempt.find({ userId, quizId: { $in: quizIds } });

    // Hide correct answers
    const safeQuizzes = quizzes.map((quiz) => {
      const safeQuestions = quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      }));

      // Find best attempt or previous attempts for this quiz
      const studentAttempts = attempts.filter((a) => a.quizId.toString() === quiz._id.toString());
      const maxScore = studentAttempts.length > 0 ? Math.max(...studentAttempts.map(a => a.score)) : null;

      return {
        _id: quiz._id,
        sectionName: quiz.sectionName,
        passMark: quiz.passMark,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        questions: safeQuestions,
        studentAttempts: studentAttempts.length,
        bestScore: maxScore,
        availableFrom: quiz.availableFrom,
        availableUntil: quiz.availableUntil,
      };
    });

    res.status(200).json({
      success: true,
      quizzes: safeQuizzes,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// For students to submit quiz
export const submitQuiz = CatchAsyncError(async (req, res, next) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const userId = req.user?._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }

    const previousAttemptsCount = await QuizAttempt.countDocuments({ userId, quizId });
    if (previousAttemptsCount >= quiz.maxAttempts) {
      return next(new ErrorHandler("Maximum attempts reached for this quiz", 400));
    }

    if (quiz.availableUntil && new Date(quiz.availableUntil) < new Date()) {
      return next(new ErrorHandler("This quiz is no longer available.", 400));
    }
    if (quiz.availableFrom && new Date(quiz.availableFrom) > new Date()) {
      return next(new ErrorHandler("This quiz is not available yet.", 400));
    }

    let correctCount = 0;
    const results = quiz.questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q._id,
        isCorrect,
        correctOptionIndex: q.correctOptionIndex,
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passMark;

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      courseId: quiz.courseId,
      score,
      passed,
      timeTaken: timeTaken || 0,
    });

    const Order = (await import("../models/orderModel.js")).default;
    const order = await Order.findOne({ userId, courseId: quiz.courseId });
    if (order && order.assignedStaffId) {
      const Notification = (await import("../models/notificationModel.js")).default;
      await Notification.create({
        userId: order.assignedStaffId,
        type: "quiz",
        title: "New Quiz Submission",
        message: `A student has submitted the quiz '${quiz.sectionName}'. Score: ${score}%`,
        url: "/staff/quiz"
      });
    }

    res.status(200).json({
      success: true,
      score,
      passed,
      results,
      attempt,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Admin endpoint to create/update quiz
export const createOrUpdateQuiz = CatchAsyncError(async (req, res, next) => {
  try {
    const { 
      courseId, sectionName, questions, passMark, timeLimit, maxAttempts,
      status, instructions, availableFrom, availableUntil, 
      shuffleQuestions, shuffleOptions, negativeMarking, deductionPerWrongAnswer
    } = req.body;

    let quiz = await Quiz.findOne({ courseId, sectionName });
    
    // Authorization Check: A staff member cannot edit a quiz created by another staff
    if (quiz && req.user.role === "staff" && quiz.staffId && quiz.staffId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to edit a quiz created by another staff member", 403));
    }

    if (quiz) {
      quiz.questions = questions;
      quiz.passMark = passMark || quiz.passMark;
      quiz.timeLimit = timeLimit || quiz.timeLimit;
      quiz.maxAttempts = maxAttempts || quiz.maxAttempts;
      quiz.status = status || quiz.status;
      quiz.instructions = instructions !== undefined ? instructions : quiz.instructions;
      quiz.availableFrom = availableFrom || quiz.availableFrom;
      quiz.availableUntil = availableUntil || quiz.availableUntil;
      quiz.shuffleQuestions = shuffleQuestions !== undefined ? shuffleQuestions : quiz.shuffleQuestions;
      quiz.shuffleOptions = shuffleOptions !== undefined ? shuffleOptions : quiz.shuffleOptions;
      quiz.negativeMarking = negativeMarking !== undefined ? negativeMarking : quiz.negativeMarking;
      quiz.deductionPerWrongAnswer = deductionPerWrongAnswer !== undefined ? deductionPerWrongAnswer : quiz.deductionPerWrongAnswer;
      // Re-assign staffId in case an older quiz is being updated by a staff
      if (req.user.role === "staff" && !quiz.staffId) {
        quiz.staffId = req.user._id;
      }
      await quiz.save();
    } else {
      quiz = await Quiz.create({
        courseId,
        staffId: req.user.role === "staff" ? req.user._id : undefined,
        sectionName,
        questions,
        passMark,
        timeLimit,
        maxAttempts,
        status,
        instructions,
        availableFrom,
        availableUntil,
        shuffleQuestions,
        shuffleOptions,
        negativeMarking,
        deductionPerWrongAnswer
      });
    }

    // Notify enrolled students
    const Order = (await import("../models/orderModel.js")).default;
    const Notification = (await import("../models/notificationModel.js")).default;
    
    // Find all users enrolled in this course
    const orders = await Order.find({ courseId }).populate("userId");
    const targetStudents = orders.map(o => o.userId).filter(u => u != null);

    const message = `A quiz '${sectionName}' has been added or updated in your course.`;
    for (const student of targetStudents) {
      await Notification.create({
        userId: student._id,
        type: "quiz",
        title: "Quiz Update",
        message,
        url: "/profile/quiz"
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Admin/Staff endpoint to get all quizzes for a course
export const getQuizzesByCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    let query = { courseId };
    if (req.user.role === "staff") {
      query.staffId = req.user._id;
    }
    const quizzes = await Quiz.find(query);
    
    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Admin/Staff endpoint for Quiz Analytics
export const getQuizAnalytics = CatchAsyncError(async (req, res, next) => {
  try {
    let quizFilter = {};
    let attemptFilter = {};

    if (req.user.role === "staff") {
      const staffId = req.user._id;
      // Filter quizzes by assigned courses and staff ownership
      const { User } = await import("../models/userModel.js");
      const staff = await User.findById(staffId);
      const assignedCourseIds = staff.assignedCourses || [];
      quizFilter = { courseId: { $in: assignedCourseIds }, staffId: req.user._id };

      // Filter attempts by assigned students
      const Order = (await import("../models/orderModel.js")).default;
      const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
      const assignedStudentIds = await getAuthorizedStaffStudents(staffId);
      
      attemptFilter = { 
        courseId: { $in: assignedCourseIds },
        userId: { $in: assignedStudentIds } 
      };
    }

    const totalQuizzes = await Quiz.countDocuments(quizFilter);
    const publishedQuizzes = await Quiz.countDocuments({ ...quizFilter, status: "published" });
    const draftQuizzes = await Quiz.countDocuments({ ...quizFilter, status: "draft" });
    
    const attempts = await QuizAttempt.find(attemptFilter);
    const totalAttempts = attempts.length;
    
    let averageScore = 0;
    let averagePassRate = 0;
    
    if (totalAttempts > 0) {
      const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = Math.round(totalScore / totalAttempts);
      
      const passCount = attempts.filter(a => a.passed).length;
      averagePassRate = Math.round((passCount / totalAttempts) * 100);
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalQuizzes,
        publishedQuizzes,
        draftQuizzes,
        totalAttempts,
        averageScore,
        averagePassRate
      }
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Admin/Staff endpoint for Quiz Leaderboard
export const getQuizLeaderboard = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.query;
    let query = {};
    if (courseId) query.courseId = courseId;
    
    if (req.user.role === "staff") {
      const Order = (await import("../models/orderModel.js")).default;
      const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
      const assignedStudentIds = await getAuthorizedStaffStudents(req.user._id);
      query.userId = { $in: assignedStudentIds };
    }

    const leaderboard = await QuizAttempt.find(query)
      .populate("userId", "name email")
      .populate("quizId", "sectionName")
      .sort({ score: -1, timeTaken: 1 })
      .limit(50);
      
    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Admin/Staff endpoint for Student Results
export const getStudentResults = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.query;
    let query = {};
    if (courseId) query.courseId = courseId;
    
    if (req.user.role === "staff") {
      const Order = (await import("../models/orderModel.js")).default;
      const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
      const assignedStudentIds = await getAuthorizedStaffStudents(req.user._id);
      query.userId = { $in: assignedStudentIds };
    }

    const results = await QuizAttempt.find(query)
      .populate("userId", "name email")
      .populate("quizId", "sectionName")
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
