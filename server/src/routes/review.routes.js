import { Router } from "express";
import { createReview,getItemsReviews } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/create").post(createReview);

router.route("/item/:itemId").get(getItemsReviews)

export default router;