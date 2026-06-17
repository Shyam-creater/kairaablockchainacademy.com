import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import {
  getDashboardSummary,
  getDashboardTrends,
  getPaginatedUsers,
  toggleUserSuspend,
  getOrdersSummary,
  getPaginatedOrders,
  getAuditLogs,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// All routes require authentication + admin role
adminRouter.use(isAuthenticated, authorizeRoles("admin"));

// Dashboard KPIs
adminRouter.get("/dashboard/summary", getDashboardSummary);
adminRouter.get("/dashboard/trends", getDashboardTrends);

// User management
adminRouter.get("/users/paginated", getPaginatedUsers);
adminRouter.post("/users/:id/suspend", toggleUserSuspend);

// Orders
adminRouter.get("/orders/summary", getOrdersSummary);
adminRouter.get("/orders", getPaginatedOrders);

// Audit logs
adminRouter.get("/audit-logs", getAuditLogs);

export default adminRouter;
