import express from "express";
import { protect } from "../middlewares/protect.middleware";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/chat.controller";

const router = express.Router();

router.get("/users", protect, getUsersForSidebar);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, sendMessage);

export default router;
