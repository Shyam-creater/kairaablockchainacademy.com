import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import {
  getStudentProgress,
  getStudentCertificates,
  getStaffEligibleStudents,
  getStaffCertificates,
  getAdminCertificates,
  recommendCertificate,
  adminApproveCertificate,
  rejectCertificate,
  revokeCertificate,
  verifyCertificate,
  getCertificateAnalytics
} from "../controllers/certificate.controller.js";

const certificateRouter = express.Router();

// Student Routes
certificateRouter.get("/certificate/student/progress", isAuthenticated, getStudentProgress);
certificateRouter.get("/certificate/student", isAuthenticated, getStudentCertificates);

// Staff Routes
certificateRouter.get("/certificate/staff/eligible", isAuthenticated, authorizeRoles("staff", "admin"), getStaffEligibleStudents);
certificateRouter.get("/certificate/staff", isAuthenticated, authorizeRoles("staff", "admin"), getStaffCertificates);
certificateRouter.post("/certificate/staff-recommend", isAuthenticated, authorizeRoles("staff", "admin"), recommendCertificate);

// Admin Routes
certificateRouter.get("/certificate/admin", isAuthenticated, authorizeRoles("admin"), getAdminCertificates);
certificateRouter.put("/certificate/admin-approve/:id", isAuthenticated, authorizeRoles("admin"), adminApproveCertificate);
certificateRouter.put("/certificate/reject/:id", isAuthenticated, authorizeRoles("staff", "admin"), rejectCertificate);
certificateRouter.put("/certificate/revoke/:id", isAuthenticated, authorizeRoles("admin"), revokeCertificate);
certificateRouter.get("/certificate/analytics", isAuthenticated, authorizeRoles("admin"), getCertificateAnalytics);

// Public Routes
certificateRouter.get("/certificate/verify/:certificateNumber", verifyCertificate);

export default certificateRouter;
