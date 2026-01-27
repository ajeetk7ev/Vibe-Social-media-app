import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

// Utility functions for validation
const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password); // min 6 chars, at least 1 letter & 1 number

const isValidUsername = (username: string) =>
    typeof username === "string" && username.length >= 3 && username.length <= 30;

//------Signup-------
export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Validate fields
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (!isValidUsername(username)) {
            return res.status(400).json({ success: false, message: "Username must be 3-30 characters long" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters, including 1 letter and 1 number",
            });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username or email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();


        // Send response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Error in signup", error);
        res.status(500).json({ success: false, message: "Signup failed" });
    }
};

//------Login-------
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters, including 1 letter and 1 number",
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                bio: user.bio,
                avatar: user.avatar,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Login failed", error });
    }
};
