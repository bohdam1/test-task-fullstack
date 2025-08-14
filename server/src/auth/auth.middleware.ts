import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; 
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
