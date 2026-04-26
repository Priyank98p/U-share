import { io } from "../app.js";
import { Chat } from "../models/chat.model.js";

export const initializeChatSocket = () => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join a user-to-user room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle send_message — persist to DB then broadcast
    socket.on("send_message", async (data) => {
      const { room, senderId, receiverId, message } = data;

      try {
        // Persist message to database
        const savedMsg = await Chat.create({
          senderId,
          receiverId,
          message,
          seen: false,
        });

        // Emit to all in room (including sender for confirmation)
        io.to(room).emit("receive_message", {
          ...data,
          _id: savedMsg._id,
          createdAt: savedMsg.createdAt,
          seen: false,
        });

        // Notify the receiver if they have a badge listener
        io.emit(`unread_update_${receiverId}`);
      } catch (error) {
        console.error("Failed to save message:", error);
        // Still emit so the UI doesn't hang
        io.to(room).emit("receive_message", data);
      }
    });

    // Mark messages as seen when user opens chat
    socket.on("mark_seen", async ({ senderId, receiverId }) => {
      try {
        await Chat.updateMany(
          { senderId, receiverId, seen: false },
          { $set: { seen: true } }
        );
        // Notify the original sender their messages were seen
        io.emit(`messages_seen_${senderId}`);
      } catch (error) {
        console.error("Failed to mark as seen:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
