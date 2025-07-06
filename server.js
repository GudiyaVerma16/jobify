import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";
// hello
// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));

// CORS configuration - Allow all Vercel domains and localhost
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.startsWith("http://localhost:")) return callback(null, true);

      // Allow all Vercel domains
      if (origin.includes("vercel.app")) return callback(null, true);

      // Allow specific known domains
      const allowedOrigins = [
        "https://jobify-smoky-theta.vercel.app",
        "https://jobify-silk-seven.vercel.app",
        "https://jobify.vercel.app",
      ];

      if (allowedOrigins.includes(origin)) return callback(null, true);

      // For production, you might want to be more restrictive
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("Not allowed by CORS"));
      }

      // For development, allow all origins
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// only when ready to deploy
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    let mongoUrl = process.env.MONGO_URL;

    // If no MONGO_URL is provided, use MongoDB Memory Server for development
    if (!mongoUrl || mongoUrl === "your connection string") {
      console.log(
        "No MONGO_URL provided, using MongoDB Memory Server for development..."
      );
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      mongoUrl = mongoServer.getUri();
      console.log("MongoDB Memory Server started at:", mongoUrl);
    }

    await connectDB(mongoUrl);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
