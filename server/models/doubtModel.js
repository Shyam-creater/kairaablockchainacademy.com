import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
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

const Doubt = mongoose.model("Doubt", doubtSchema);
export default Doubt;
