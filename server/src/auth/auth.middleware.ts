  import { Request, Response } from "express";
  import jwt from "jsonwebtoken";
  import { Ad } from "../ads/ad.model";

  const JWT_SECRET = process.env.JWT_SECRET || "secret";

  export const authMiddleware = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>

    try {
      

    const decoded = jwt.verify(token, JWT_SECRET);
    
    (req as any).userId = (decoded as any).userId; 
   
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
  };