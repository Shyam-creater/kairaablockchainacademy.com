import mongoose from "mongoose";
import Certificate from "./models/certificateModel.js";

const MONGO_URI = "mongodb+srv://Academy:MU7gl0n5lu1U0eyR@cluster0.kxjzl.mongodb.net/academy_details?appName=Cluster0";

const resetCerts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const result = await Certificate.deleteMany({});
        console.log("Deleted certificates:", result.deletedCount);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.disconnect();
    }
};

resetCerts();
