import { Router } from "express";
import { getChatHistory, getConversations, getUnreadCount, markMessagesAsSeen } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/conversations").get(getConversations);
router.route("/unread-count").get(getUnreadCount);
router.route("/seen/:senderId").patch(markMessagesAsSeen);
router.route("/:recipientId").get(getChatHistory);

export default router;
