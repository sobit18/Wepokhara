import News from "../models/News.js";

export const createNews = async (data) => {
  return await News.create(data);
};

export const getAllNews = async () => {
  return await News.find().sort({ createdAt: -1 });
};


export const getNewsByCategory = async (category) => {
  return await News.find({ category }).sort({ createdAt: -1 });
};

export const getNewsByWard = async (ward) => {
  return await News.find({ ward }).sort({ createdAt: -1 });
};

export const updateNews = async (id, data) => {
  return await News.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNews = async (id) => {
  return await News.findByIdAndDelete(id);
};
