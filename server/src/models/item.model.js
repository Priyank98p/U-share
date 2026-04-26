import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description helps borrowers decide"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Calculators",
        "Project Kits",
        "Sports",
        "Lab & Equipment",
      ],
    },
    brand: {
      type: String,
    },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair"],
      default: "Good",
    },
    rentalPricePerDay: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    availableTo: {
      type: Date,
    },
    pickupLocation: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

function arrayLimit(val) {
  return val.length <= 5;
}

itemSchema.index({ title: "text", description: "text" });

export const Item = mongoose.model("Item", itemSchema);
