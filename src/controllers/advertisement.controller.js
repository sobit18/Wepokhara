import { createAd, getAllAds, getAdById, updateAd, deleteAd } from "../services/advertisement.service.js";

export const createAdController = async (req, res) => {
  try {
    const { startDate, endDate, description, userId } = req.body;
    const photo = req.file ? req.file.path : null;

    if (!photo) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const ad = await createAd({
      photo,
      startDate,
      endDate,
      description,
      userId,
    });
    res.status(201).json({ message: "Advertisement created successfully", ad });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


