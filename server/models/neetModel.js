import mongoose from "mongoose";

const neetFileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true, default: 'General' },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const neetSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  files: [neetFileSchema]
}, { timestamps: true });

const NeetModel = mongoose.model("Neet", neetSchema);
export default NeetModel;
