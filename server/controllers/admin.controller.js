import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
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
    const result = await getPaginatedOrdersService({
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 15, 100),
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
