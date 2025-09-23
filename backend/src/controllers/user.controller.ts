import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from 'bcrypt';
import uploadFileToCloudiary from "../utils/fileUploadToCloudinary";
import mongoose from "mongoose";



export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { name, bio, password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is requried"
            })
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Match password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }



        // Handle image upload if provided
        let avatar = "";
        if (req.files && (req.files as any).avatar) {
            const file = (req.files as any).avatar as any;
            const uploadResponse = await uploadFileToCloudiary(file, "user_images", 800);
            avatar = uploadResponse.secure_url;
        }

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();

        const { password: _, ...updatedUser } = user.toObject();
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Error in updateProfile", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export const getProfileDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id || (req as any).user._id; 

        const user = await User.findById(userId)
            .select("-password") // exclude password
            .populate("followers", "username avatar") // optional
            .populate("following", "username avatar");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("Error in getProfileDetails:", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user._id;
    const { id: targetUserId } = req.params; // user to follow

    if (myId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const targetUser = await User.findById(targetUserId);
    const me = await User.findById(myId);

    if (!targetUser || !me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if already following
    if (me.following.includes(new mongoose.Types.ObjectId(targetUserId))) {
      return res.status(400).json({
        success: false,
        message: "You already follow this user",
      });
    }

    me.following.push(new mongoose.Types.ObjectId(targetUserId));
    targetUser.followers.push(myId);

    await me.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `You are now following ${targetUser.username}`,
    });
  } catch (error) {
    console.error("Error in followUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user._id;
    const { id: targetUserId } = req.params;

    if (myId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    const targetUser = await User.findById(targetUserId);
    const me = await User.findById(myId);

    if (!targetUser || !me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if following
    if (!me.following.includes(new mongoose.Types.ObjectId(targetUserId))) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user",
      });
    }

    // remove from arrays
    me.following = me.following.filter(
      (userId: any) => userId.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (userId: any) => userId.toString() !== myId
    );

    await me.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `You have unfollowed ${targetUser.username}`,
    });
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

