import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import {
  createPost,
  getFeed,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  getUserPosts,
} from "../controllers/post.controller";

const router = Router();

// Feed and create
router.get("/", protect, getFeed);
router.post("/", protect, createPost);

// Single post
router.get("/:id", protect, getPostById);
router.delete("/:id", protect, deletePost);

// User posts
router.get("/user/:userId", protect, getUserPosts);

// Likes
router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);

// Comments
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", protect, getComments);

export default router;


