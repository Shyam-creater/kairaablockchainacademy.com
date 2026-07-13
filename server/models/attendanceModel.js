import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
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
    joinTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "absent",
    },
  },
  { timestamps: true }
);

// Prevent multiple attendance records for the same meeting and student
attendanceSchema.index({ meetingId: 1, studentId: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
