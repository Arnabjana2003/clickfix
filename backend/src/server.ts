import envConfig from "./envConfig";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./db/index.db";
import v1Router from "./routes/v1/v1Router";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import sendMail from "./utils/nodemailer";
import { getWelcomeMail } from "./utils/mailTempletes";

const app = express();

app.use(helmet()); // Security headers

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
});
app.use(limiter);

// Logging
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = fs
  .createWriteStream(path.join(logDir, "access.log"), {
    flags: "a",
  })
  .on("error", (err) => {
    console.error("Failed to write to log file:", err);
  });
morgan.token("json", (req: Request, res: Response) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    ip: req.ip,
    // userAgent: req.get("user-agent") || null,
  });
});
app.use(morgan(":json", { stream: logFile }));

// database connection
connectDB();

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination");
  process.exit(0);
});

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test-mail", async (req, res) => {
  try {
    const re = await sendMail({
      html: getWelcomeMail(""),
      recipientMail: "developer.arnabjana@gmail.com",
      subject: "Welcome to ClicknFix, Let's fix your life",
      attachments: [],
    });
    res.send({ re });
  } catch (error) {
    res.send(error);
  }
});

//controller apis
app.use("/api/v1", v1Router);

// 404 Handler
app.use((_, res) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found",
  });
});

const PORT = envConfig.server.port || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n\nServer is running on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

export { app };
