import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());


// api endpoints
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js"
import bookingRouter from "./routes/booking.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/items",itemRouter)
app.use("/api/v1/bookings",bookingRouter)

export {app}