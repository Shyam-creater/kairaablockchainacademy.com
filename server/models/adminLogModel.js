import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    actor: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    action: {
      type: String,
      required: true,
      enum: [
        "DELETE_USER",
        "SUSPEND_USER",
        "REACTIVATE_USER",
        "UPDATE_USER_ROLE",
        "DELETE_COURSE",
        "CREATE_COURSE",
        "UPDATE_COURSE",
        "DELETE_BLOG",
        "CREATE_BLOG",
        "DELETE_GALLERY",
        "UPLOAD_GALLERY",
        "VIEW_DASHBOARD",
        "OTHER",
      ],
    },
    target: {
      type: String,
      default: "",
    },
    details: {
      type: Object,
      default: {},
    },
    ip: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ "actor.id": 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;
