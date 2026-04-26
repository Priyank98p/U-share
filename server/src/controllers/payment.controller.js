import Razorpay from "razorpay";
import crypto from "crypto";
import { Booking } from "../models/booking.model.js";
import { Item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { itemId, startDate, endDate } = req.body;

    if (!itemId || !startDate || !endDate) {
        throw new ApiError(400, "Item ID and rental dates are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) throw new ApiError(400, "Start date cannot be in the past");
    if (start >= end) throw new ApiError(400, "End date must be after start date");

    const item = await Item.findById(itemId);
    if (!item) throw new ApiError(404, "Item not found");

    // Safely get ownerId as string whether it's populated or not
    const ownerIdStr = (item.ownerId?._id || item.ownerId)?.toString();

    if (ownerIdStr === req.user._id.toString()) {
        throw new ApiError(400, "You cannot rent your own item");
    }

    const overlap = await Booking.findOne({
        itemId,
        status: { $in: ["approved", "ongoing"] },
        $and: [{ startDate: { $lt: end } }, { endDate: { $gt: start } }],
    });
    if (overlap) {
        throw new ApiError(
            400,
            `Item already booked from ${overlap.startDate.toDateString()} to ${overlap.endDate.toDateString()}`
        );
    }

    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * item.rentalPricePerDay + (item.depositAmount || 0);

    const options = {
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        receipt: `ushare_${Date.now()}`,
        notes: {
            itemId: itemId,
            borrowerId: req.user._id.toString(),
            ownerId: ownerIdStr,
        },
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json(
        new ApiResponse(200, {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            itemTitle: item.title,
            totalPrice,
            diffDays,
            deposit: item.depositAmount || 0,
            ownerId: ownerIdStr,
        }, "Razorpay order created")
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        itemId,
        startDate,
        endDate,
        totalPrice,
        paymentMethod,
    } = req.body;

    const item = await Item.findById(itemId);
    if (!item) throw new ApiError(404, "Item not found");

    // Safely extract ownerId
    const ownerObjectId = item.ownerId?._id || item.ownerId;

    if (paymentMethod === "cash") {
        const booking = await Booking.create({
            itemId,
            borrowerId: req.user._id,
            ownerId: ownerObjectId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice: Number(totalPrice),
            deposit: item.depositAmount || 0,
            status: "pending",
        });

        return res.status(201).json(
            new ApiResponse(201, booking, "Booking created (Cash). Awaiting owner approval.")
        );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Payment verification details are missing");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = process.env.RAZORPAY_KEY_SECRET || "default_secret";
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed. Invalid signature.");
    }

    const booking = await Booking.create({
        itemId,
        borrowerId: req.user._id,
        ownerId: ownerObjectId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(totalPrice),
        deposit: item.depositAmount || 0,
        status: "pending",
    });

    return res.status(201).json(
        new ApiResponse(201, {
            booking,
            paymentId: razorpay_payment_id,
        }, "Payment verified & booking created successfully")
    );
});

export { createOrder, verifyPayment };
