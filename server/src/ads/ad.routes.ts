import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import multer from "multer";
import { createAd, getAds, getAdById, updateAd, deleteAd } from "./ad.controller";

const router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { files: 5 } });


router.post("/", authMiddleware, upload.array("images", 5), createAd);
router.get("/", getAds); 
router.get("/:id", getAdById);
router.put("/:id", authMiddleware, upload.array("images", 5), updateAd);
router.delete("/:id", authMiddleware, deleteAd);

export default router;
