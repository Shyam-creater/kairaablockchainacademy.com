import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Certificate from "../models/certificateModel.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Order from "../models/orderModel.js";
import { checkCertificateEligibility } from "../utils/eligibility.engine.js";
import { generateCertificatePDF, generateCertificateQR } from "../utils/certificate.generator.js";
import sendMail from "../utils/sendMail.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Generate unique Certificate Number
const generateUniqueCertNumber = async (courseCode) => {
  const year = new Date().getFullYear();
  let unique = false;
  let certNumber = "";
  while (!unique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    certNumber = `ACA-${year}-${courseCode}-${randomNum}`;
    const exists = await Certificate.findOne({ certificateNumber: certNumber });
    if (!exists) unique = true;
  }
  return certNumber;
};

// 1. Get Student Progress (replaces request logic)
export const getStudentProgress = CatchAsyncError(async (req, res, next) => {
  try {
    const studentId = req.user._id;
    // Get all courses the student has purchased
    const orders = await Order.find({ userId: studentId });
    const coursesProgress = [];

    for (const order of orders) {
      if (!order.courseId) continue;
      const courseId = order.courseId; // it's a string
      const course = await Course.findById(courseId).select("name thumbnail");
      if (!course) continue;

      // Evaluate Eligibility Engine
      const { isEligible, stats } = await checkCertificateEligibility(studentId, courseId);
      
      // Check if certificate already exists
      const existingCert = await Certificate.findOne({ studentId, courseId });

      coursesProgress.push({
        course,
        isEligible,
        stats,
        certificate: existingCert || null
      });
    }

    res.status(200).json({
      success: true,
      progress: coursesProgress
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 2. Get Student's Issued Certificates
export const getStudentCertificates = CatchAsyncError(async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id, status: "approved" })
      .populate("courseId", "name thumbnail")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, certificates });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 3. Staff: Get Eligible Students
export const getStaffEligibleStudents = CatchAsyncError(async (req, res, next) => {
  try {
    // Get students assigned specifically to this staff member
    const orders = await Order.find({ assignedStaffId: req.user._id });
    const eligibleStudents = [];

    for (const order of orders) {
      if (!order.userId || !order.courseId) continue;
      const studentId = order.userId; // string
      const courseId = order.courseId; // string

      // Check if already recommended or approved
      const existing = await Certificate.findOne({ studentId, courseId });
      if (existing) continue; // Skip if already recommended, approved, etc.

      // Run engine
      const { isEligible, stats } = await checkCertificateEligibility(studentId, courseId);
      
      const student = await User.findById(studentId).select("name email avatar");
      const course = await Course.findById(courseId).select("name");

      if (student && course) {
        eligibleStudents.push({
          student,
          course,
          isEligible,
          stats
        });
      }
    }

    res.status(200).json({ success: true, eligibleStudents });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 4. Get Staff Recommended Certificates (Pending Admin Approval)
export const getStaffCertificates = CatchAsyncError(async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ staffId: req.user._id })
      .populate("studentId", "name email avatar")
      .populate("courseId", "name");

    res.status(200).json({ success: true, certificates });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 5. Staff Recommend Certificate
export const recommendCertificate = CatchAsyncError(async (req, res, next) => {
  try {
    const { studentId, courseId, remarks } = req.body;
    
    if (!remarks) return next(new ErrorHandler("Staff remarks are required to recommend a certificate.", 400));

    // Verify Eligibility again
    const { isEligible } = await checkCertificateEligibility(studentId, courseId);
    if (!isEligible) return next(new ErrorHandler("Student is not eligible for a certificate.", 400));

    // Check if already recommended
    const existing = await Certificate.findOne({ studentId, courseId });
    if (existing && existing.status !== "returned_for_review" && existing.status !== "rejected") {
      return next(new ErrorHandler(`Certificate already exists with status: ${existing.status}`, 400));
    }

    if (existing && (existing.status === "returned_for_review" || existing.status === "rejected")) {
      existing.status = "staff_recommended";
      existing.remarks = remarks;
      existing.staffId = req.user._id;
      await existing.save();
      return res.status(200).json({ success: true, message: "Certificate recommendation updated.", certificate: existing });
    }

    const certificate = await Certificate.create({
      studentId,
      courseId,
      staffId: req.user._id,
      status: "staff_recommended",
      remarks
    });

    res.status(201).json({ success: true, message: "Student successfully recommended for a certificate.", certificate });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 6. Get Admin Certificates (All)
export const getAdminCertificates = CatchAsyncError(async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .populate("studentId", "name email avatar")
      .populate("courseId", "name")
      .populate("staffId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, certificates });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 7. Admin Final Approve (Generates PDF & Email)
export const adminApproveCertificate = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id)
      .populate("studentId", "name email")
      .populate("courseId", "name tags");

    if (!certificate) return next(new ErrorHandler("Certificate not found", 404));
    if (certificate.status !== "staff_recommended") return next(new ErrorHandler("Certificate must be staff recommended first", 400));

    // Generate unique Number
    const courseCode = certificate.courseId.tags ? certificate.courseId.tags.substring(0,3).toUpperCase() : "GEN";
    const certNumber = await generateUniqueCertNumber(courseCode);

    // Generate QR
    const qrCodeUrl = await generateCertificateQR(certNumber);

    // Generate PDF Buffer
    const pdfBuffer = await generateCertificatePDF({
      studentName: certificate.studentId.name,
      courseName: certificate.courseId.name,
      issueDate: new Date(),
      certificateNumber: certNumber,
      qrCodeUrl
    });

    // Save PDF locally
    const fileName = `cert_${certNumber}.pdf`;
    const pdfPath = path.join(__dirname, "../public/certificates", fileName);
    fs.mkdirSync(path.join(__dirname, "../public/certificates"), { recursive: true });
    fs.writeFileSync(pdfPath, pdfBuffer);

    certificate.status = "approved";
    certificate.certificateNumber = certNumber;
    certificate.verificationCode = crypto.randomBytes(8).toString("hex");
    certificate.issueDate = new Date();
    certificate.qrCodeUrl = qrCodeUrl;
    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8000}`;
    certificate.pdfUrl = `${serverUrl}/public/certificates/${fileName}`;
    certificate.approvedBy = req.user._id;
    certificate.approvedAt = new Date();
    certificate.remarks = req.body.remarks || certificate.remarks;

    await certificate.save();

    try {
      await sendMail({
        email: certificate.studentId.email,
        subject: "Congratulations! Your Certificate is Ready",
        template: "certificate-ready.ejs",
        data: {
          name: certificate.studentId.name,
          course: certificate.courseId.name,
          certNumber
        }
      });
      certificate.emailSent = true;
      certificate.emailSentAt = new Date();
      await certificate.save();
    } catch (e) {
      console.log("Email failed:", e);
    }

    res.status(200).json({ success: true, message: "Certificate approved and generated.", certificate });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 8. Reject or Return Certificate
export const rejectCertificate = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks, status } = req.body; // status can be "rejected" or "returned_for_review"
    
    if (!remarks) return next(new ErrorHandler("Remarks are required.", 400));

    const certificate = await Certificate.findById(id);
    if (!certificate) return next(new ErrorHandler("Not found", 404));

    certificate.status = status === "returned_for_review" ? "returned_for_review" : "rejected";
    certificate.remarks = remarks;
    await certificate.save();

    res.status(200).json({ success: true, message: `Certificate ${certificate.status}.`, certificate });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 9. Revoke Certificate
export const revokeCertificate = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByIdAndUpdate(id, { status: "revoked" }, { new: true });
    res.status(200).json({ success: true, message: "Certificate revoked.", certificate });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 10. Verify Certificate Publicly
export const verifyCertificate = CatchAsyncError(async (req, res, next) => {
  try {
    const { certificateNumber } = req.params;
    const certificate = await Certificate.findOne({ certificateNumber })
      .populate("studentId", "name")
      .populate("courseId", "name");

    if (!certificate || certificate.status !== "approved") {
      return res.status(404).json({ success: false, message: "Certificate not found or invalid." });
    }

    certificate.verificationLogs.push({
      scannedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    await certificate.save();

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// 11. Analytics
export const getCertificateAnalytics = CatchAsyncError(async (req, res, next) => {
  try {
    const total = await Certificate.countDocuments();
    const approved = await Certificate.countDocuments({ status: "approved" });
    const pending = await Certificate.countDocuments({ status: "staff_recommended" });
    res.status(200).json({ success: true, analytics: { total, approved, pending } });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
