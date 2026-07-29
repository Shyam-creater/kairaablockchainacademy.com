import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: String },
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    watchPercentage: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create a unique index for user + course + lesson
progressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
