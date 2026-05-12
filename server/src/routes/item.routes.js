import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createListing,
  getAllItems,
  getItemById,
  updateItem,
  getMyItems,
} from "../controllers/item.controller.js";
import { deleteItemListing } from "../controllers/item.controller.js";

const router = Router();

router.route("/").get(getAllItems);

// Define specific routes BEFORE dynamic routes like /:id
router.route("/my-items").get(verifyJWT, getMyItems);

router.route("/:id").get(getItemById);

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

router.route("/:id").patch(updateItem).delete(deleteItemListing);

export default router;
