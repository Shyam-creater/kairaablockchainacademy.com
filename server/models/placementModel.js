import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Learning", "Interview Ready", "Interview Scheduled", "Placed"],
      default: "Learning",
    },
    company: { type: String },
    package: { type: String },
    joiningDate: { type: Date },
    recruiterNotes: { type: String },
    history: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const Placement = mongoose.model("Placement", placementSchema);
export default Placement;
