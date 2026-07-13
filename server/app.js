import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { ErrorMiddleware } from "./middleware/error.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import orderRouter from "./routes/order.route.js";
import notificationRoute from "./routes/notification.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import layoutRouter from "./routes/layout.route.js";
import bodyParser from "body-parser";
import galleryRoute from "./routes/gallery.route.js";
import blogRoute from "./routes/blog.route.js";
import adminRouter from "./routes/admin.route.js";
import progressRouter from "./routes/progress.route.js";
import resumeRouter from "./routes/resume.route.js";
import quizRouter from "./routes/quiz.route.js";
import certificateRouter from "./routes/certificate.route.js";
import staffRouter from "./routes/staff.route.js";
import studentRouter from "./routes/student.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

export const app = express();

// Serve static files from the public directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injection attacks

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// cookie parser
app.use(cookieParser());

// morgan request logger with colorized status
app.use(morgan(function (tokens, req, res) {
  const status = tokens.status(req, res) || "";
  let colorStatus = status;
  const statusCode = parseInt(status, 10);
  
  if (statusCode >= 500) {
    colorStatus = `\x1b[31m${status}\x1b[0m`; // Red
  } else if (statusCode >= 400) {
    colorStatus = `\x1b[33m${status}\x1b[0m`; // Yellow
  } else if (statusCode >= 300) {
    colorStatus = `\x1b[36m${status}\x1b[0m`; // Cyan
  } else if (statusCode >= 200) {
    colorStatus = `\x1b[32m${status}\x1b[0m`; // Green
  }

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    '- Status:',
    colorStatus
  ].join(' ')
}));

// body parser
// app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

const corsOptions = {
  credentials: true,
  origin: [
    "https://kairaablockchainacademy.com",
    "https://kairaaacademy.com",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// routes
app.use("/api/v1/", userRouter);

app.use("/api/v1/", courseRouter);
app.use("/api/v1/", resumeRouter);
app.use(
  "/api/v1/",
  orderRouter,
  analyticsRouter,
  layoutRouter,
  quizRouter,
  certificateRouter
);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/", galleryRoute);
app.use("/api/v1/", blogRoute);
app.use("/api/v1/", progressRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.get("/test", (req, res, next) => {
  res.status(200).json({
    message: "API is 06 07 2024",
  });
});
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  res.statusCode = 400;
  next(err);
});
app.use(ErrorMiddleware);
