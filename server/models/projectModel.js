import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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
    },
    projectTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectTask",
      required: true,
    },
    submissionLink: {
      type: String, // Can be a zip URL or a GitHub link
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "revision_requested"],
      default: "pending",
    },
    marks: {
      type: String,
    },
    replies: [
      {
        sender: {
          type: String,
          enum: ["student", "staff"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        attachment: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
