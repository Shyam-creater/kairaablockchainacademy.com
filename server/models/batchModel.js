import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
      required: true, // The Mentor assigned to this Batch
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
