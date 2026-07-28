import express from "express";
import {
  createSponsorRequest,
  getAllSponsorRequests,
  toggleHighlight,
  getHighlightedRequests,
  deleteSponsorRequest
} from "../controllers/sponsorRequestController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/submit", createSponsorRequest);
router.get("/highlighted", getHighlightedRequests);

// Admin routes
router.get("/all", isAuthenticated, authorizeRoles("admin"), getAllSponsorRequests);
router.put("/highlight/:id", isAuthenticated, authorizeRoles("admin"), toggleHighlight);
router.delete("/delete/:id", isAuthenticated, authorizeRoles("admin"), deleteSponsorRequest);

export default router;
