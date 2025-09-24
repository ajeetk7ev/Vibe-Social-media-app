import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { createStory, getStories, viewStory, deleteStory } from "../controllers/story.controller";

const router = Router();

// Stories feed and create
router.get("/", protect, getStories);
router.post("/", protect, createStory);

// View and delete
router.post("/:id/view", protect, viewStory);
router.delete("/:id", protect, deleteStory);

export default router;


