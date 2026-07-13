import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ipAddress: { type: String },
    browser: { type: String },
    device: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

loginHistorySchema.index({ userId: 1, createdAt: -1 });

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
export default LoginHistory;
