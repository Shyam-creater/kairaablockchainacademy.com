import mongoose from "mongoose";

const NeetPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    yearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Neet",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    fileTitle: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "success",
    },
  },
  { timestamps: true }
);

const NeetPurchase = mongoose.model("NeetPurchase", NeetPurchaseSchema);
export default NeetPurchase;
