import { Router } from "express";
import { createBooking, updateBookingStatus, getUserBookings, getOwnerRequests } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/request").post(createBooking)

router.route("/status/:bookingId").patch(updateBookingStatus)

router.route("/my-bookings").get(getUserBookings)

router.route("/my-requests").get(getOwnerRequests)

export default router