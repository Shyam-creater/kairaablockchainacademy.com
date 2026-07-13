import mongoose from "mongoose";

const dashboardAnalyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    strongestTopic: {
      type: String,
      default: "",
    },
    weakestTopic: {
      type: String,
      default: "",
    },
    averageWatchSpeed: {
      type: Number,
      default: 1,
    },
    overallProgress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DashboardAnalytics = mongoose.model("DashboardAnalytics", dashboardAnalyticsSchema);

export default DashboardAnalytics;
