import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { registerUser,userLogin, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "studentIdCard",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT,userLogout)

export default router;
