import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  registerUser,
  userLogin,
  userLogout,
  refreshAccessToken,
  updateAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount:1
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
router.route("/avatar").patch(
  verifyJWT, 
  upload.single("avatar"),
  updateAvatar
);
router.route("refresh-token").post(refreshAccessToken);

export default router;
