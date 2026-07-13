import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Batch from "../models/batchModel.js";
import {
  getDashboardSummaryService,
  getDashboardTrendsService,
  getPaginatedUsersService,
  toggleUserSuspendService,
  getOrdersSummaryService,
  getPaginatedOrdersService,
  getAuditLogsService,
} from "../services/admin.service.js";

/**
 * GET /api/v1/admin/dashboard/summary
 * Returns aggregated KPIs: users, courses, orders, revenue, registrations
 */
export const getDashboardSummary = CatchAsyncError(async (req, res, next) => {
  try {
    const summary = await getDashboardSummaryService();
    res.status(200).json({ success: true, summary });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/dashboard/trends?days=30
 * Returns time-series data: signups + orders per day
 */
export const getDashboardTrends = CatchAsyncError(async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const trends = await getDashboardTrendsService(days);
    res.status(200).json({ success: true, trends });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/users/paginated?page=1&limit=10&search=&role=&suspended=
 * Returns paginated, searchable user list
 */
export const getPaginatedUsers = CatchAsyncError(async (req, res, next) => {
  try {
    const { page, limit, search, role, suspended } = req.query;
    const result = await getPaginatedUsersService({
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 10, 100),
      search: search || "",
      role: role || "",
      suspended: suspended || "",
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * POST /api/v1/admin/users/:id/suspend
 * Toggle user suspended status, writes audit log
 */
export const toggleUserSuspend = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";
    const user = await toggleUserSuspendService(id, req.user, ip);
    res.status(200).json({
      success: true,
      message: user.isSuspended
        ? "User suspended successfully"
        : "User reactivated successfully",
      isSuspended: user.isSuspended,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/orders/summary
 * Returns order analytics: total, revenue, avg, last 30d, top courses
 */
export const getOrdersSummary = CatchAsyncError(async (req, res, next) => {
  try {
    const summary = await getOrdersSummaryService();
    res.status(200).json({ success: true, summary });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/orders?page=1&limit=15
 * Returns paginated orders list
 */
export const getPaginatedOrders = CatchAsyncError(async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const staffId = req.user?.role === "staff" ? req.user._id : null;
    const result = await getPaginatedOrdersService({
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 15, 100),
      staffId,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/audit-logs?page=1&limit=20&action=
 * Returns paginated audit logs
 */
export const getAuditLogs = CatchAsyncError(async (req, res, next) => {
  try {
    const { page, limit, action } = req.query;
    const result = await getAuditLogsService({
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 20, 100),
      action: action || "",
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * PUT /api/v1/admin/assign-staff
 * Assigns a staff member to an order or registration
 */
export const assignStaff = CatchAsyncError(async (req, res, next) => {
  try {
    const { id, type, staffId } = req.body;
    let result;
    
    const update = staffId ? { $set: { assignedStaffId: staffId } } : { $unset: { assignedStaffId: "" } };

    if (type === "registration") {
      const Registration = (await import("../models/registrationModel.js")).default;
      result = await Registration.findByIdAndUpdate(id, update, { new: true });
    } else if (type === "order") {
      const Order = (await import("../models/orderModel.js")).default;
      result = await Order.findByIdAndUpdate(id, update, { new: true }).populate("userId", "name");
      
      // Auto-sync the course to the staff member's authorized assignedCourses array
      if (staffId && result && result.courseId) {
        const { User } = await import("../models/userModel.js");
        await User.findByIdAndUpdate(staffId, {
          $addToSet: { assignedCourses: result.courseId }
        });
      }
    } else {
      return next(new ErrorHandler("Invalid assignment type", 400));
    }

    if (!result) {
      return next(new ErrorHandler("Record not found", 404));
    }

    // Create notification if assigning staff
    if (staffId) {
      const Notification = (await import("../models/notificationModel.js")).default;
      const { User } = await import("../models/userModel.js");
      const sendMail = (await import("../utils/sendMail.js")).default;

      const staff = await User.findById(staffId);
      const typeName = type === "order" ? "Course Purchase" : "Registration";
      let studentName = "";
      if (type === "order" && result.userId?.name) {
        studentName = ` from student ${result.userId.name}`;
      } else if (type === "registration" && result.firstName) {
        studentName = ` from student ${result.firstName} ${result.lastName}`;
      }
      
      const message = `You have been assigned to handle a ${typeName}${studentName}. Please check your dashboard for details.`;

      await Notification.create({
        userId: staffId,
        type: "system",
        title: "New Student Assignment",
        message
      });

      if (staff && staff.email) {
        try {
          await sendMail({
            email: staff.email,
            subject: "New Student Assignment - Kairaa Academy",
            template: "notification.ejs",
            data: { user: { name: staff.name }, title: "New Student Assignment", message, dashboardUrl: process.env.CLIENT_URL + "/staff" }
          });
        } catch (err) {
          console.error("Failed to send assignment email:", err);
        }
      }
    }

    res.status(200).json({ success: true, message: "Staff assigned successfully", data: result });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// --- BATCH MANAGEMENT ---

// Create a new batch
export const createBatch = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, courseId, staffId } = req.body;
    if (!name || !courseId || !staffId) {
      return next(new ErrorHandler("Please provide name, courseId, and staffId", 400));
    }

    const batch = await Batch.create({ name, courseId, staffId });

    res.status(201).json({ success: true, message: "Batch created successfully", batch });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all batches
export const getAllBatches = CatchAsyncError(async (req, res, next) => {
  try {
    const batches = await Batch.find().populate("courseId", "name").populate("staffId", "name email").populate("students", "name email");
    res.status(200).json({ success: true, batches });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Add student to batch
export const addStudentToBatch = CatchAsyncError(async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return next(new ErrorHandler("Please provide studentId", 400));
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return next(new ErrorHandler("Batch not found", 404));
    }

    // VERIFICATION: Check if student has actually purchased/enrolled in this course
    const order = await Order.findOne({ userId: studentId, courseId: batch.courseId });
    if (!order) {
      return next(new ErrorHandler("Student is not enrolled in this course. Cannot add to batch.", 400));
    }

    if (!batch.students.includes(studentId)) {
      batch.students.push(studentId);
      await batch.save();
    }

    // Update the student's Order so they are individually mapped to the batch's staffId
    order.assignedStaffId = batch.staffId;
    await order.save();

    res.status(200).json({ success: true, message: "Student added to batch successfully", batch, orderUpdated: true });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/users/:id/profile
 * Get 360 profile of a user
 */
export const getUserProfile360 = CatchAsyncError(async (req, res, next) => {
  try {
    const { getUserProfile360Service } = await import("../services/admin.service.js");
    const profile = await getUserProfile360Service(req.params.id);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * POST /api/v1/admin/users/bulk-action
 * Perform bulk actions on users
 */
export const bulkActionUsers = CatchAsyncError(async (req, res, next) => {
  try {
    const { userIds, action, payload } = req.body;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";
      
    const { bulkActionUsersService } = await import("../services/admin.service.js");
    const result = await bulkActionUsersService({
      userIds,
      action,
      payload,
      actorUser: req.user,
      ip
    });

    res.status(200).json({ success: true, message: `Bulk action '${action}' completed`, result });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/staff/metrics
 * Get staff metrics for dashboard
 */
export const getStaffMetrics = CatchAsyncError(async (req, res, next) => {
  try {
    const { getStaffMetricsService } = await import("../services/admin.service.js");
    const metrics = await getStaffMetricsService();
    res.status(200).json({ success: true, metrics });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * GET /api/v1/admin/staff/:id/profile360
 * Get 360 profile for a staff member
 */
export const getStaffProfile360 = CatchAsyncError(async (req, res, next) => {
  try {
    const { getStaffProfile360Service } = await import("../services/admin.service.js");
    const profile = await getStaffProfile360Service(req.params.id);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
