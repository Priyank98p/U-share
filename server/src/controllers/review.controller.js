import { Booking } from "../models/booking.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Review } from "../models/review.model";
import mongoose, { isValidObjectId } from "mongoose";

const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating) {
    throw new ApiError(400, "Booking ID and rating are required");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== "completed") {
    throw new ApiError(400, "You can only review completed rentals");
  }

  const currentUserId = req.user._id.toString();
  const borrowerId = booking.borrowerId.toString();
  const ownerId = booking.ownerId.toString();

  let revieweeId;

  if (currentUserId === borrowerId) {
    // The borrower is leaving the review, so the reviewee is the owner
    revieweeId = ownerId;
  } else if (currentUserId === ownerId) {
    // The owner is leaving the review, so the reviewee is the borrower
    revieweeId = borrowerId;
  } else {
    throw new ApiError(403, "You are not a participant in this booking");
  }

  const existingReview = await Review.findOne({
    bookingId,
    reviewerId: req.user._id,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already left a review for this booking");
  }

  const review = await Review.create({
    bookingId,
    itemId: booking.itemId, // Pulled securely from the booking doc
    reviewerId: req.user._id,
    revieweeId,
    rating: Number(rating),
    comment: comment ? comment.trim() : "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review submitted successfully"));
});

const getItemsReviews = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  if (!isValidObjectId(itemId)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  const stats = await Review.aggregate([
    {
      $match: {
        itemId: new mongoose.Schema.Types.ObjectId(itemId),
      },
    },
    {
      $group: {
        _id: "$itemId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const reviews = await Review.find({ itemId })
    .populate("reviewerId", "fullname avatar")
    .sort({ createdAt: -1 })
    .limit(10);

  const finalStats =
    stats.length > 0 ? stats[0] : { averageRating: 0, totalReviews: 0 };

  finalStats.averageRating = Math.round(finalStats.averageRating * 10) / 10;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: finalStats,
        reviews,
      },
      "Reviews and ratings fetched successfully",
    ),
  );
});

export { createReview,getItemsReviews };
