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
  assignStaff,
  createBatch,
  getAllBatches,
  addStudentToBatch,
  getUserProfile360,
  bulkActionUsers,
  getStaffMetrics,
  getStaffProfile360
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// Allow admin and staff to access the router
adminRouter.use(isAuthenticated, authorizeRoles("admin", "staff"));

// Dashboard KPIs (Both Admin and Staff)
adminRouter.get("/dashboard/summary", getDashboardSummary);
adminRouter.get("/dashboard/trends", getDashboardTrends);

// User management (Admin Only)
adminRouter.get("/users/paginated", authorizeRoles("admin"), getPaginatedUsers);
adminRouter.post("/users/:id/suspend", authorizeRoles("admin"), toggleUserSuspend);
adminRouter.get("/users/:id/profile", authorizeRoles("admin", "staff"), getUserProfile360);
adminRouter.post("/users/bulk-action", authorizeRoles("admin"), bulkActionUsers);

// Orders (Admin and Staff)
adminRouter.get("/orders/summary", authorizeRoles("admin", "staff"), getOrdersSummary);
adminRouter.get("/orders", authorizeRoles("admin", "staff"), getPaginatedOrders);

// Audit logs (Admin Only)
adminRouter.get("/audit-logs", authorizeRoles("admin"), getAuditLogs);

// Staff Assignment (Admin Only)
adminRouter.post("/assign-staff", isAuthenticated, authorizeRoles("admin"), assignStaff);

// Staff Management
adminRouter.get("/staff/metrics", authorizeRoles("admin"), getStaffMetrics);
adminRouter.get("/staff/:id/profile360", authorizeRoles("admin"), getStaffProfile360);

// Batch Management
adminRouter.post("/batches", isAuthenticated, authorizeRoles("admin"), createBatch);
adminRouter.get("/batches", isAuthenticated, authorizeRoles("admin"), getAllBatches);
adminRouter.put("/batches/:batchId/students", isAuthenticated, authorizeRoles("admin"), addStudentToBatch);

export default adminRouter;
