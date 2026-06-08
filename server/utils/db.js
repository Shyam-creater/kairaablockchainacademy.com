import mongoose from "mongoose";

// const DB_NAME='lms'

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
