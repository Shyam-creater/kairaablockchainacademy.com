import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CertificateSchema = new mongoose.Schema({
  pdfUrl: String
}, { strict: false });

const Certificate = mongoose.model("Certificate", CertificateSchema);

const fixUrls = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || "");
    const certs = await Certificate.find({ pdfUrl: { $regex: "^/public" } });
    for (let cert of certs) {
      cert.pdfUrl = "https://back.kairaablockchainacademy.com" + cert.pdfUrl;
      await cert.save();
    }
    console.log("Fixed " + certs.length + " certificates.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
fixUrls();
