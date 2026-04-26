import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  registerUser,
  userLogin,
  userLogout,
  refreshAccessToken,
  updateAvatar,
  toggleWishlist,
  getWishlist,
  getCurrentUser,
  updateProfile,
  updateStudentIdCard,
  getDashboardStats,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "studentIdCard",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// Protected routes
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/profile").patch(verifyJWT, updateProfile);
router.route("/avatar").patch(
  verifyJWT, 
  upload.single("avatar"),
  updateAvatar
);
router.route("/student-id").patch(
  verifyJWT,
  upload.single("studentIdCard"),
  updateStudentIdCard
);
router.route("/dashboard-stats").get(verifyJWT, getDashboardStats);
router.route("/wishlist/:itemId").post(verifyJWT, toggleWishlist);
router.route("/wishlist").get(verifyJWT, getWishlist);

export default router;
