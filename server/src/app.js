import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Rate Limiting — strict for auth, relaxed for general API
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// api endpoints
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import chatRouter from "./routes/chat.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";

// Apply auth rate limiter on login/register only
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);

// Apply general rate limiter to all API routes
app.use("/api/v1", apiLimiter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export { app, httpServer, io };