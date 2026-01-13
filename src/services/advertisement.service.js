import Advertisement from "../models/Advertisement.js";

export const createAd = async (data) => {
  return await Advertisement.create(data);
};

export const getAllAds = async () => {
  return await Advertisement.find().sort({ createdAt: -1 });
};

export const getAdById = async (id) => {
  return await Advertisement.findById(id);
};

export const updateAd = async (id, data) => {
  return await Advertisement.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAd = async (id) => {
  return await Advertisement.findByIdAndDelete(id);
};
