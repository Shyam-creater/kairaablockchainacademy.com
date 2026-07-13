import express from "express";
import { getWorkspaceDashboard } from "../controllers/dashboard.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/workspace-dashboard",
  isAuthenticated,
  getWorkspaceDashboard
);

export default dashboardRouter;
