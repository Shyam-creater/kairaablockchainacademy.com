import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null, // If null, applies to ALL students assigned to this staff for the course
    },
    topic: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    zoomLink: {
      type: String,
      default: "https://zoom.us/j/1234567890", // Placeholder for actual Zoom API integration
    },
    recordingUrl: {
      type: String,
    },
    materials: [
      {
        public_id: String,
        url: String,
        name: String,
      }
    ],
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
