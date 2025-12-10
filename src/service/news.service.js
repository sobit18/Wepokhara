import News from "../models/News.js";

export const createNews = async (data) => {
  return await News.create(data);
};


