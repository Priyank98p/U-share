import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    deposit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "ongoing",
        "returned",
        "cancelled",
      ],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true },
);

// Cross-Field Validation
bookingSchema.pre("validate", function () {
  if (this.startDate && this.endDate) {
    if (this.endDate <= this.startDate) {
      this.invalidate(
        "endDate",
        "End date must be strictly after the start date",
      );
    }
  }
});

export const Booking = mongoose.model("Booking", bookingSchema);
