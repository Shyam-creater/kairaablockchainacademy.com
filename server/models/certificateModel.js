import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Staff assigned to the course who recommended/reviewed it
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
    certificateNumber: {
      type: String,
      unique: true,
      sparse: true,
      // e.g., ACA-2026-FSD-000001
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["pending", "staff_approved", "staff_recommended", "returned_for_review", "approved", "rejected", "revoked"],
      default: "pending",
    },
    issueDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    pdfUrl: {
      type: String, // Path or URL to the generated PDF
    },
    qrCodeUrl: {
      type: String, // Data URI or URL of the QR code
    },
    remarks: {
      type: String, // Rejection or revision notes
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who finalized it
    },
    approvedAt: {
      type: Date,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    lastDownloadedAt: {
      type: Date,
    },
    verificationLogs: [
      {
        scannedAt: { type: Date, default: Date.now },
        ipAddress: String,
        userAgent: String,
      },
    ],
  },
  { timestamps: true }
);

// Prevent multiple certificates per student per course
certificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
