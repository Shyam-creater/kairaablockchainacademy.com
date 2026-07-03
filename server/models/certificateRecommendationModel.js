import mongoose from "mongoose";

const certificateRecommendationSchema = new mongoose.Schema(
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
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const CertificateRecommendation = mongoose.model("CertificateRecommendation", certificateRecommendationSchema);
export default CertificateRecommendation;
