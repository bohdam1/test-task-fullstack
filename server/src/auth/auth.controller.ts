import { Request, Response } from "express";
import { User } from "../users/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "20d" });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "20d" });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
