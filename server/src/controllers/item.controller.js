import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js";
import { Item } from "../models/item.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import NodeCache from "node-cache";

// In-memory cache with 30-second TTL for item listings
const itemCache = new NodeCache({ stdTTL: 30, checkperiod: 10 });

const createListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    brand,
    condition,
    rentalPricePerDay,
    depositAmount,
    availableFrom,
    availableTo,
    pickupLocation,
  } = req.body;

  if (!title || !description || !category || !rentalPricePerDay) {
    throw new ApiError(
      400,
      "Title, description, category, and rental price are mandatory",
    );
  }

  const imageFiles = req.files?.images;

  if (!imageFiles || imageFiles.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  if (imageFiles.length > 5) {
    throw new ApiError(401, "You can upload a maximum of 5 images per listing");
  }

  const uploadPromises = imageFiles.map((file) =>
    uploadOnCloudinary(file.path),
  );
  const uploadResults = await Promise.all(uploadPromises);

  const uploadedImageUrls = uploadResults
    .filter((result) => result !== null)
    .map((result) => result.url);

  if (uploadedImageUrls.length === 0) {
    throw new ApiError(401, "Failed to upload images on server");
  }

  const newItem = await Item.create({
    ownerId: req.user?._id,
    title: title.trim(),
    description: description.trim(),
    category,
    brand: brand ? brand.trim() : "",
    condition: condition || "Good",
    rentalPricePerDay: Number(rentalPricePerDay),
    depositAmount: depositAmount ? Number(depositAmount) : 0,
    images: uploadedImageUrls,
    availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
    availableTo: availableTo ? new Date(availableTo) : undefined,
    pickupLocation: pickupLocation ? pickupLocation.trim() : "",
  });

  // Invalidate cache when a new item is added
  itemCache.flushAll();

  return res
    .status(200)
    .json(new ApiResponse(200, newItem, "Item listed successfully for rent"));
});

const getAllItems = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, date, condition, page: pageParam, limit: limitParam } = req.query;

  // Build cache key from query params
  const cacheKey = JSON.stringify({ category, search, minPrice, maxPrice, date, condition, pageParam, limitParam });
  const cached = itemCache.get(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  let filter = { isActive: true };

  if (category) filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    filter.rentalPricePerDay = {};
    if (minPrice) filter.rentalPricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.rentalPricePerDay.$lte = Number(maxPrice);
  }

  if (condition) filter.condition = condition;

  if (date) {
    const requestedDate = new Date(date);
    filter.availableFrom = { $lte: requestedDate };
    filter.$or = [
      { availableTo: { $gte: requestedDate } },
      { availableTo: { $exists: false } },
      { availableTo: null },
    ];
  }

  const page = parseInt(pageParam) || 1;
  const limit = parseInt(limitParam) || 12;
  const skip = (page - 1) * limit;

  const items = await Item.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("ownerId", "fullname email rating department");

  const totalItems = await Item.countDocuments(filter);

  const responseData = new ApiResponse(
    200,
    {
      items,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
    "Items fetched successfully",
  );

  // Store in cache
  itemCache.set(cacheKey, responseData);

  return res.status(200).json(responseData);
});

const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid item id format");
  }

  const item = await Item.findById(id).populate(
    "ownerId",
    "fullname email department year avatar rating",
  );

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item fetched successfully"));
});

const getMyItems = asyncHandler(async (req, res) => {
  const { active } = req.query;

  let filter = { ownerId: req.user._id };

  if (active !== undefined) {
    filter.isActive = active === "true";
  }

  const items = await Item.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        items,
        items.length === 0
          ? "You haven't listed any items yet"
          : "Inventory fetched successfully",
      ),
    );
});

const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, rentalPricePerDay, condition, availableTo } =
    req.body;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid Item ID format");
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to edit this listing");
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title ? title.trim() : item.title,
        description: description ? description.trim() : item.description,
        rentalPricePerDay: rentalPricePerDay
          ? Number(rentalPricePerDay)
          : item.rentalPricePerDay,
        condition: condition || item.condition,
        availableTo: availableTo || item.availableTo,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  // Invalidate cache
  itemCache.flushAll();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedItem, "Item updated successfully"));
});

const deleteItemListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid item id format");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized for deleting this listing");
  }

  // Delete images from Cloudinary
  if (item.images && item.images.length > 0) {
    await Promise.allSettled(item.images.map((url) => deleteFromCloudinary(url)));
  }

  await Item.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true },
  );

  // Invalidate cache
  itemCache.flushAll();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item deleted successfully"));
});

export {
  createListing,
  getAllItems,
  getItemById,
  updateItem,
  deleteItemListing,
  getMyItems,
};
