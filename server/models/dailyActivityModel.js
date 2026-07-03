import mongoose from "mongoose";

const dailyActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalActions: {
      type: Number,
      default: 0,
    },
    watchTimeMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DailyActivity = mongoose.model("DailyActivity", dailyActivitySchema);

export default DailyActivity;
