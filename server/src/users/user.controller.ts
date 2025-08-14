import { Request, Response } from "express";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; 
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("name email").lean(); 
    if (!user) return res.status(404).json({ message: "User not found" });

    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, email, password } = req.body;

    const updateData: any = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
