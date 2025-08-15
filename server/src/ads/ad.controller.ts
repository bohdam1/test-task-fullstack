import { Request, Response } from "express";
import { Ad } from "./ad.model";


export const createAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { title, description, category, price, city } = req.body;
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

    const ad = await Ad.create({
      title,
      description,
      category,
      price,
      city,
      images,
      userId
    });

    res.status(201).json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // може бути undefined, якщо користувач не авторизований

    const { page = 1, limit = 10, category, city, minPrice, maxPrice, search } = req.query;

    const query: any = {}; // прибрали userId

    if (category) query.category = category;
    if (city) query.city = city;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Ad.countDocuments(query);

    // додаємо поле isOwner для фронтенду
    const adsWithOwnerFlag = ads.map(ad => ({
      ...ad.toObject(),
      isOwner: userId ? ad.userId.toString() === userId : false,
    }));

    res.json({
      ads: adsWithOwnerFlag,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAdById = async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.userId.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    
    const { title, description, city, price } = req.body;
    if (title) ad.title = title;
    if (description) ad.description = description;
    if (city) ad.city = city;
    if (price) ad.price = price;

    
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    
    const uploadedFiles = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
  
    ad.images = [...existingImages, ...uploadedFiles];

    await ad.save();
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.userId.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await ad.deleteOne();
    res.json({ message: "Ad deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
