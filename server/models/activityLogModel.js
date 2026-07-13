import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "ACCOUNT_CREATED",
        "COURSE_PURCHASED",
        "ASSIGNMENT_SUBMITTED",
        "CERTIFICATE_GENERATED",
        "LOGIN_EVENT",
        "PROFILE_UPDATED",
        "OTHER",
      ],
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    deviceInfo: {
      type: String,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
