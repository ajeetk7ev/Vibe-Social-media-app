import { Request, Response } from "express";
import mongoose from "mongoose";
import { Story } from "../models/Story";
import { User } from "../models/User";
import uploadFileToCloudiary from "../utils/fileUploadToCloudinary";
import { Notification } from "../models/Notification";
import { getReceiverSocketId, io } from "../socket";

// Create a new story (auto-expires in 24h via model pre-save)
export const createStory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as mongoose.Types.ObjectId;

    const file = (req.files && (req as any).files.media) ? (req as any).files.media : null;
    if (!file) {
      return res.status(400).json({ success: false, message: "Media file is required" });
    }

    const uploaded = await uploadFileToCloudiary(file, "stories");
    const mediaUrl = (uploaded as any).secure_url;
    const mimeType: string = (file as any).mimetype || "";
    const mediaType = mimeType.startsWith("video") ? "video" : "image";

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    const story = await Story.create({ user: userId, mediaUrl, mediaType, expiresAt });
    const populatedStory = await Story.findById(story._id).populate("user", "username avatar").lean();

    return res.status(201).json({ success: true, story: populatedStory });
  } catch (error) {
    console.error("Error in createStory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get stories for feed (all users you follow + yours)
export const getStories = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const now = new Date();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const startOf24HoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get stories from users I follow OR myself
    const stories = await Story.find({
      user: { $in: [...user.following, userId] },
      expiresAt: { $gt: now }
    })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar")
      .lean();
    return res.status(200).json({ success: true, stories });
  } catch (error) {
    console.error("Error in getStories:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark a story as viewed by current user
export const viewStory = async (req: Request, res: Response) => {
  try {
    const viewerId = (req as any).user._id.toString();
    const { id } = req.params; // story id
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    const alreadyViewed = story.viewers.some((uid) => uid.toString() === viewerId);
    if (!alreadyViewed) {
      story.viewers.push(new mongoose.Types.ObjectId(viewerId));
      await story.save();
    }
    return res.status(200).json({ success: true, viewers: story.viewers.length });
  } catch (error) {
    console.error("Error in viewStory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete own story
export const deleteStory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const { id } = req.params; // story id
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });
    if (story.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    await story.deleteOne();
    return res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error) {
    console.error("Error in deleteStory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Like a story
export const likeStory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as mongoose.Types.ObjectId;
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    const alreadyLiked = story.likes.some((uid) => uid.toString() === userId.toString());
    if (alreadyLiked) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }

    story.likes.push(userId);
    await story.save();

    // notify story author
    try {
      if (story.user.toString() !== userId.toString()) {
        const newNotification = await Notification.create({
          user: story.user,
          fromUser: userId,
          type: "like",
          post: story._id // We use 'post' field to link to the story ID for now, or we could add a 'story' field to Notification schema
        });

        const receiverSocketId = getReceiverSocketId(story.user.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", newNotification);
        }
      }
    } catch (_) { }

    return res.status(200).json({ success: true, likes: story.likes.length });
  } catch (error) {
    console.error("Error in likeStory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unlike a story
export const unlikeStory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    const before = story.likes.length;
    story.likes = story.likes.filter((uid) => uid.toString() !== userId);

    if (story.likes.length === before) {
      return res.status(400).json({ success: false, message: "Not liked yet" });
    }

    await story.save();
    return res.status(200).json({ success: true, likes: story.likes.length });
  } catch (error) {
    console.error("Error in unlikeStory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


