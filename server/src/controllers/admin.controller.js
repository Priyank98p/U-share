import { User } from "../models/user.model.js";
import { Item } from "../models/item.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const verifiedUsers = await User.countDocuments({ isVerified: true, role: "user" });
  const activeListings = await Item.countDocuments({ isActive: true });
  
  // Calculate total revenue (5% of total booking prices)
  const bookings = await Booking.find({ status: { $in: ["approved", "ongoing", "returned"] } });
  const totalVolume = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalRevenue = Math.round(totalVolume * 0.05);

  return res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      verifiedUsers,
      activeListings,
      totalRevenue,
    }, "Admin stats fetched successfully")
  );
});

const getPendingVerifications = asyncHandler(async (req, res) => {
  const users = await User.find({ isVerified: false, role: "user" }).select("-password -refreshToken");
  return res.status(200).json(
    new ApiResponse(200, users, "Pending verifications fetched successfully")
  );
});

const verifyUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, user, "User verified successfully")
  );
});

const getModerationFeed = asyncHandler(async (req, res) => {
  // For now, just return all active items as a feed, or those with many views/reports if we had them.
  const items = await Item.find().populate("ownerId", "fullname email").sort("-createdAt");
  return res.status(200).json(
    new ApiResponse(200, items, "Moderation feed fetched successfully")
  );
});

const toggleItemStatus = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  item.isActive = !item.isActive;
  await item.save();

  return res.status(200).json(
    new ApiResponse(200, item, `Item ${item.isActive ? "activated" : "deactivated"} successfully`)
  );
});

export {
  getAdminStats,
  getPendingVerifications,
  verifyUser,
  getModerationFeed,
  toggleItemStatus
};
