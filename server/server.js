import "dotenv/config";
import { app } from "./app.js";
import morgan from "morgan";
import connectDB from "./utils/db.js";
import { v2 as cloudinary } from 'cloudinary'
import cors from 'cors';


// cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY,
})

app.use(cors());
// HTTP request logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
  connectDB();
});
