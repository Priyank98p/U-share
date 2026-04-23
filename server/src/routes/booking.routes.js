import { Router } from "express";
import { createBooking, updateBookingStatus } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/request").post(createBooking)

router.route("/status/:bookingId").patch(updateBookingStatus)

export default router