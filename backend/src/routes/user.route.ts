import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import {
  updateProfile,
  getProfileDetails,
  getProfileByUsername,
  followUser,
  unfollowUser,
  getAllUsers,
} from "../controllers/user.controller";

const router = Router();

// Get current user's profile
router.get("/profile", protect, getProfileDetails);

// Get all users
router.get("/all", protect, getAllUsers);

// Update current user's profile
router.put("/profile", protect, updateProfile);

// Follow a user
router.post("/follow/:id", protect, followUser);

// Unfollow a user
router.post("/unfollow/:id", protect, unfollowUser);

// Get a user's profile by username
router.get("/username/:username", protect, getProfileByUsername);

// Get a user's profile by id
router.get("/profile/:id", protect, getProfileDetails);

export default router;
