import { Router } from "express";
import { 
  getAdminStats, 
  getPendingVerifications, 
  verifyUser, 
  getModerationFeed, 
  toggleItemStatus 
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// All routes require admin authentication
router.use(verifyJWT, isAdmin);

router.get("/stats", getAdminStats);
router.get("/pending-verifications", getPendingVerifications);
router.patch("/verify-user/:userId", verifyUser);
router.get("/moderation-feed", getModerationFeed);
router.patch("/toggle-item/:itemId", toggleItemStatus);

export default router;
