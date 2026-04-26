import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Get chat history between the logged-in user and a recipient.
 * Auto-marks messages as seen.
 */
const getChatHistory = asyncHandler(async (req, res) => {
  const { recipientId } = req.params;
  const userId = req.user._id;

  if (!recipientId) throw new ApiError(400, "Recipient ID is required");

  if (recipientId === userId.toString()) {
    throw new ApiError(400, "You cannot chat with yourself");
  }

  // Auto-mark messages from recipient as seen
  await Chat.updateMany(
    { senderId: recipientId, receiverId: userId, seen: false },
    { $set: { seen: true } }
  );

  const messages = await Chat.find({
    $or: [
      { senderId: userId, receiverId: recipientId },
      { senderId: recipientId, receiverId: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("senderId", "fullname avatar")
    .populate("receiverId", "fullname avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, { messages }, "Chat history fetched successfully"));
});

/**
 * Get all conversations for the current user with last message and unread count.
 */
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Chat.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
        },
        lastMessage: { $first: "$message" },
        lastMessageAt: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$receiverId", userId] }, { $eq: ["$seen", false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { lastMessageAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        lastMessage: 1,
        lastMessageAt: 1,
        unreadCount: 1,
        "user.fullname": 1,
        "user.avatar": 1,
        "user.email": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, conversations, "Conversations fetched successfully"));
});

/**
 * Get total unread message count (unique sender count) for the Navbar badge.
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await Chat.aggregate([
    { $match: { receiverId: userId, seen: false } },
    { $group: { _id: "$senderId" } },
    { $count: "uniqueSenders" },
  ]);

  const count = result.length > 0 ? result[0].uniqueSenders : 0;

  return res.status(200).json(
    new ApiResponse(200, { unreadCount: count }, "Unread count fetched")
  );
});

/**
 * Mark all messages from a specific sender as seen.
 */
const markMessagesAsSeen = asyncHandler(async (req, res) => {
  const { senderId } = req.params;
  const userId = req.user._id;

  if (!senderId) throw new ApiError(400, "Sender ID is required");

  await Chat.updateMany(
    { senderId: new mongoose.Types.ObjectId(senderId), receiverId: userId, seen: false },
    { $set: { seen: true } }
  );

  return res.status(200).json(new ApiResponse(200, {}, "Messages marked as seen"));
});

export { getChatHistory, getConversations, getUnreadCount, markMessagesAsSeen };
