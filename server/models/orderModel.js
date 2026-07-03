import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
    required:true,
    },
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Order= mongoose.model("Order", OrderSchema);
export default Order;