import "dotenv/config";
import { app } from "./app.js";
import morgan from "morgan";
import connectDB from "./utils/db.js";
import { v2 as cloudinary } from 'cloudinary'
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";


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

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "https://kairaablockchainacademy.com",
      "https://kairaaacademy.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"]
  }
});

let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;
  io.emit("updateOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("updateOnlineUsers", onlineUsers);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
  connectDB();
});
