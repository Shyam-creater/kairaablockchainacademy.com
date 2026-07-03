import mongoose from "mongoose";

const dropIndexes = async () => {
  try {
    await mongoose.connect("mongodb+srv://Academy:MU7gl0n5lu1U0eyR@cluster0.kxjzl.mongodb.net/academy_details?appName=Cluster0");
    const db = mongoose.connection.db;
    const coll = db.collection("certificates");
    
    // Safely drop indexes if they exist
    try { await coll.dropIndex("uuid_1"); console.log("Dropped uuid_1"); } catch(e){}
    try { await coll.dropIndex("certificateNumber_1"); console.log("Dropped certificateNumber_1"); } catch(e){}
    try { await coll.dropIndex("verificationCode_1"); console.log("Dropped verificationCode_1"); } catch(e){}
    
    console.log("Indexes cleaned.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
dropIndexes();
