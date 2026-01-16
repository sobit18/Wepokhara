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


export const getAllAdsController = async (req, res) => {
  try {
    const ads = await getAllAds();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await getAdById(id);
    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, description, userId } = req.body;
    const updateData = { startDate, endDate, description, userId };

    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedAd = await updateAd(id, updateData);
    if (!updatedAd) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    res.status(200).json({ message: "Advertisement updated successfully", ad: updatedAd });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




