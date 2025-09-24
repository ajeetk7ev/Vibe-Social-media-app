import { Request, Response } from "express";
import mongoose from "mongoose";
import { Story } from "../models/Story";
import uploadFileToCloudiary from "../utils/fileUploadToCloudinary";

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

    const story = await Story.create({ user: userId, mediaUrl, mediaType });
    return res.status(201).json({ success: true, story });
  } catch (error) {
    console.error("Error in createStory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get stories for feed (all users you follow + yours). For now, return latest non-expired stories.
export const getStories = async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const stories = await Story.find({ expiresAt: { $gt: now } })
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


