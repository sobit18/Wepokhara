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