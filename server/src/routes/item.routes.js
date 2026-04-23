import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createListing,getAllItems } from "../controllers/item.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  createListing,
);

router.route("/").get(getAllItems)

export { router };
