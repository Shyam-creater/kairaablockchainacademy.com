import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CertificateSchema = new mongoose.Schema({}, { strict: false });
const Certificate = mongoose.model("Certificate", CertificateSchema);

const resetCertificates = async () => {
  try {
    await mongoose.connect("mongodb+srv://Academy:MU7gl0n5lu1U0eyR@cluster0.kxjzl.mongodb.net/academy_details?appName=Cluster0");
    const result = await Certificate.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} certificates from the database.`);
    process.exit(0);
  } catch (err) {
    console.error("Error resetting certificates:", err);
    process.exit(1);
  }
};
resetCertificates();
