import mongoose from "mongoose";

const courseResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId },
    lectureId: { type: mongoose.Schema.Types.ObjectId, required: true },
    playbackTime: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseResumeSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseResume = mongoose.model("CourseResume", courseResumeSchema);
export default CourseResume;
