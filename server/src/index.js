import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, httpServer, io } from "./app.js";
import { initializeChatSocket } from "./sockets/chat.socket.js";

dotenv.config({
  path: "./.env",
});

initializeChatSocket(io);

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed", error);
  });
