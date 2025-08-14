import { Request, Response } from "express";
import { Ad } from "./ad.model";

// Створення оголошення
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

// Отримання лише оголошень користувача
export const getAds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { page = 1, limit = 10, category, city, minPrice, maxPrice, search } = req.query;
    const query: any = { userId };

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

    res.json({
      ads,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Отримання одного оголошення за id (тільки власник)
export const getAdById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Оновлення оголошення (тільки власник)
export const updateAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { id } = req.params;
    const { title, description, city, price, existingImages } = req.body;

    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.userId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    const oldImages: string[] = existingImages ? JSON.parse(existingImages) : [];
    const files = req.files as Express.Multer.File[];
    const newImages: string[] = files ? files.map(f => f.path) : [];

    ad.images = [...oldImages, ...newImages];
    ad.title = title;
    ad.description = description;
    ad.city = city;
    ad.price = price;

    await ad.save();
    res.json(ad);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Видалення оголошення (тільки власник)
export const deleteAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.userId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: "Ad deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
