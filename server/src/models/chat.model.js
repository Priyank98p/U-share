import mongoose, { Schema, Types } from "mongoose";

const chatSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: [1000, "Message cannot exceed 1000 characters"],
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// compound index
chatSchema.index({ receiverId: 1, seen: 1 });

export default Chat = mongoose.model("Chat", chatSchema);
