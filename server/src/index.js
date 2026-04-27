import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, httpServer, io } from "./app.js";
import { initializeChatSocket } from "./sockets/chat.socket.js";

dotenv.config({
  path: "./.env",
});

// Initialize database connection
connectDB().catch((error) => {
  console.log("Mongodb connection failed", error);
});

// For Vercel serverless, export the app
export default app;

// For local development, start the server
if (process.env.NODE_ENV !== "production") {
  initializeChatSocket(io);
  httpServer.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port: ${process.env.PORT}`);
  });
}
