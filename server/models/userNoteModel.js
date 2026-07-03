import mongoose from "mongoose";

const userNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userNoteSchema.index({ userId: 1, createdAt: -1 });

const UserNote = mongoose.model("UserNote", userNoteSchema);
export default UserNote;
