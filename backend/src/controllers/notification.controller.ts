import { Request, Response } from "express";
import { Notification } from "../models/Notification";

// Get current user's notifications (latest first)
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user._id;
    const notifications = await Notification.find({ user: myId })
      .sort({ createdAt: -1 })
      .populate("fromUser", "username avatar")
      .populate("post", "_id")
      .lean();
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error in getMyNotifications:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark a notification as read
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user._id.toString();
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, user: myId });
    if (!notif) return res.status(404).json({ success: false, message: "Notification not found" });
    if (!notif.isRead) {
      notif.isRead = true;
      await notif.save();
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in markNotificationRead:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user._id;
    await Notification.updateMany({ user: myId, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in markAllNotificationsRead:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user._id.toString();
    const { id } = req.params;
    const deleted = await Notification.findOneAndDelete({ _id: id, user: myId });
    if (!deleted) return res.status(404).json({ success: false, message: "Notification not found" });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


