import { Request, Response } from "express";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { getReceiverSocketId, io } from "../socket";

export const getUsersForSidebar = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = (req as any).user._id;

        // Find users that the current user has exchanged messages with
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        }).sort({ createdAt: -1 });

        const chattedUserIds = new Set<string>();
        messages.forEach((msg) => {
            if (msg.senderId.toString() !== loggedInUserId.toString()) {
                chattedUserIds.add(msg.senderId.toString());
            }
            if (msg.receiverId.toString() !== loggedInUserId.toString()) {
                chattedUserIds.add(msg.receiverId.toString());
            }
        });

        // Also include people they follow for convenience
        const user = await User.findById(loggedInUserId).populate("following", "_id username avatar name");
        user?.following.forEach((f: any) => chattedUserIds.add(f._id.toString()));

        const filteredUsers = await User.find({
            _id: { $in: Array.from(chattedUserIds) }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = (req as any).user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = (req as any).user._id;

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
