import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

router.get("/", protect, getMyNotifications);
router.post("/read-all", protect, markAllNotificationsRead);
router.post("/:id/read", protect, markNotificationRead);
router.delete("/:id", protect, deleteNotification);

export default router;


