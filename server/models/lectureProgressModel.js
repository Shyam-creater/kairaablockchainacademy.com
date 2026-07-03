import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    watchTime: {
      type: Number,
      default: 0,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const LectureProgress = mongoose.model("LectureProgress", lectureProgressSchema);

export default LectureProgress;
