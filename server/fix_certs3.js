import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  pdfUrl: String
}, { strict: false });

const Certificate = mongoose.model("Certificate", CertificateSchema);

const fixUrls = async () => {
  try {
    await mongoose.connect("mongodb+srv://academy_platform:q1w2e3r4t5y6@academy.d5f5zps.mongodb.net/academy_db");
    const certs = await Certificate.find({ pdfUrl: { $regex: "^http://localhost:3000" } });
    for (let cert of certs) {
      cert.pdfUrl = cert.pdfUrl.replace("http://localhost:3000", "https://back.kairaablockchainacademy.com");
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
