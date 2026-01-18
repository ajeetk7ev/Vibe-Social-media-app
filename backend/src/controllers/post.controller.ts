import { Request, Response } from "express";
import mongoose from "mongoose";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import uploadFileToCloudiary from "../utils/fileUploadToCloudinary";
import { Notification } from "../models/Notification";
import { getReceiverSocketId, io } from "../socket";

// Create a new post with optional media (images/videos)
export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as mongoose.Types.ObjectId;
    const { caption } = req.body as { caption?: string };

    const mediaArray: { url: string; mimeType: string }[] = [];

    if (req.files) {
      const files = Array.isArray((req as any).files.media)
        ? ((req as any).files.media as any[])
        : (req as any).files.media
          ? [((req as any).files.media as any)]
          : [];

      for (const file of files) {
        const uploaded = (await uploadFileToCloudiary(
          file,
          "post_media"
        )) as any;
        mediaArray.push({ url: uploaded.secure_url, mimeType: file.mimetype });
      }
    }

    const post = await Post.create({ author: userId, caption, media: mediaArray });

    const populated = await Post.findById(post._id)
      .populate("author", "username avatar")
      .lean();

    return res.status(201).json({ success: true, post: populated });
  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get feed: latest posts (optionally could be following only later)
// Get feed: latest posts with pagination
export const getFeed = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar")
      .lean();

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error("Error in getFeed:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single post by id
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("author", "username avatar")
      .lean();
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error in getPostById:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a post (author only)
export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Error in deletePost:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as mongoose.Types.ObjectId;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const alreadyLiked = post.likes.some((uid) => uid.toString() === userId.toString());
    if (alreadyLiked) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }

    post.likes.push(userId);
    await post.save();
    // notify post author
    try {
      if (post.author.toString() !== userId.toString()) {
        const newNotification = await Notification.create({ user: post.author, fromUser: userId, type: "like", post: post._id });
        const receiverSocketId = getReceiverSocketId(post.author.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", newNotification);
        }
      }
    } catch (_) { }
    return res.status(200).json({ success: true, likes: post.likes.length });
  } catch (error) {
    console.error("Error in likePost:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const before = post.likes.length;
    post.likes = post.likes.filter((uid) => uid.toString() !== userId);
    if (post.likes.length === before) {
      return res.status(400).json({ success: false, message: "Not liked yet" });
    }
    await post.save();
    return res.status(200).json({ success: true, likes: post.likes.length });
  } catch (error) {
    console.error("Error in unlikePost:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as mongoose.Types.ObjectId;
    const { id } = req.params; // post id
    const { text } = req.body as { text: string };

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = await Comment.create({ post: post._id, user: userId, text });
    // notify post author
    try {
      if (post.author.toString() !== userId.toString()) {
        const newNotification = await Notification.create({ user: post.author, fromUser: userId, type: "comment", post: post._id });
        const receiverSocketId = getReceiverSocketId(post.author.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", newNotification);
        }
      }
    } catch (_) { }
    return res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("Error in addComment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get comments for a post
export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // post id
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar")
      .lean();
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error in getComments:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .lean();
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


