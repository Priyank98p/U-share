import { Booking } from "../models/booking.model.js";
import { Item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBooking = asyncHandler(async (req, res) => {
  const { itemId, startDate, endDate } = req.body;

  if (!itemId || !startDate || !endDate) {
    throw new ApiError(400, "Item id and rental dates are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date()
  today.setHours(0,0,0,0)

  if(start < today){
    throw new ApiError(400,"Start date cannot be in the past")
  }
  if (start >= end) {
    throw new ApiError(401, "End date must be after start date");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Cannot book your own item");
  }

  const overLappingBooking = await Booking.findOne({
    itemId,
    status: { $in: ["approved", "ongoing"] },
    $and: [{ startDate: { $lt: end } }, { endDate: { $gt: start } }],
  });

  if(overLappingBooking){
    throw new ApiError(400, `This item is already booked from ${overLappingBooking.startDate.toDateString()} to ${overLappingBooking.endDate.toDateString()}`)
  }

  const diffDays = Math.ceil(Math.abs(end-start)/(1000*60*60*24))
  const totalPrice = (diffDays * item.rentalPricePerDay) + (item.depositAmount || 0)

  const booking = await Booking.create({
    itemId,
    borrowerId: req.user._id,
    ownerId: item.ownerId,
    startDate: start,
    endDate:end,
    totalPrice:totalPrice,
    deposit:item.depositAmount || 0,
    status: "pending"
  })

  return res.status(201).json(
    new ApiResponse(201, booking, "Booking request sent successfully")
  );
});

const updateBookingStatus = asyncHandler(async(req,res) =>{
    const {bookindId, status} = req.body

    if(!["approved","rejected"].includes(status)){
        throw new ApiError(400, "Invalid status update")
    }

    const booking  = await Booking.findById(bookindId)
    if(!booking){
        throw new ApiError(404, "Booking not found")
    }

    if(booking.ownerId.toString() !== req.user._id.toString()){
        throw new ApiError(401,"You are not authorized manage this booking")
    }

    booking.status = status
    await booking.save()

    return res.status(200).json(new ApiResponse(200,booking, `Booking status has been ${status}`))
})

export {createBooking, updateBookingStatus}
