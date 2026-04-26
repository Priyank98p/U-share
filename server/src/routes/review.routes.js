import { Router } from "express";
import { createReview, getItemsReviews, getRecentReviews } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public route — no auth needed for recent reviews
router.route("/recent").get(getRecentReviews);
router.route("/item/:itemId").get(getItemsReviews);

// Protected routes
router.use(verifyJWT);
router.route("/create").post(createReview);

export default router;