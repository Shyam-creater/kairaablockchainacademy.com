import mongoose from "mongoose";

const sponsorRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  imageUrl: { type: String }, // To hold the uploaded image string or URL
  reason: { type: String, required: true },
  isHighlighted: { type: Boolean, default: false }
}, { timestamps: true });

export const SponsorRequestModel = mongoose.model("SponsorRequest", sponsorRequestSchema);
