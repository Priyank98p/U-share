import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-order").post(createOrder);
router.route("/verify").post(verifyPayment);

export default router;
