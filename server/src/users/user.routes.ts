import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { getProfile, updateProfile } from "./user.controller";

const router = Router();

router.get("/profile", getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
