import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, httpServer, io } from "./app.js";
import { initializeChatSocket } from "./sockets/chat.socket.js";

dotenv.config({
  path: "./.env",
});

// Initialize database connection
connectDB()
  .then(() => {
    // Initialize socket.io connection handlers
    initializeChatSocket();
    
    // Use httpServer instead of app.listen to bind both Express and Socket.io to the same port
    httpServer.listen(process.env.PORT || 8000, () => {
      console.log("Server is running at port:", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Database Conection failed", error);
  });


