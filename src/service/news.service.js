import News from "../models/News.js";

export const createNews = async (data) => {
  return await News.create(data);
};

export const getAllNews = async () => {
  return await News.find().sort({ createdAt: -1 });
};
