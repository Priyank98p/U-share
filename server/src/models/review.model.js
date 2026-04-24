import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    itemId: { 
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revieweeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxLength: [1000, "Review comment cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ bookingId: 1, reviewerId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);