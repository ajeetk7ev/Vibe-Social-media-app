import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { createStory, getStories, viewStory, deleteStory, likeStory, unlikeStory } from "../controllers/story.controller";

const router = Router();

// Stories feed and create
router.get("/", protect, getStories);
router.post("/", protect, createStory);

// View and delete
router.post("/:id/view", protect, viewStory);
router.delete("/:id", protect, deleteStory);
// Like/Unlike
router.post("/:id/like", protect, likeStory);
router.post("/:id/unlike", protect, unlikeStory);

export default router;


