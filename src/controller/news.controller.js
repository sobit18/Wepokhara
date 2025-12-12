import { createNews, getAllNews, getNewsByCategory, updateNews, deleteNews, getNewsByWard } from "../services/news.service.js";

export const createNewsController = async (req, res) => {
  try {
    const { title, content, category, ward, userId } = req.body;
    const image = req.file ? req.file.path : null;

    const news = await createNews({ title, content, category, image, ward, userId });
    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllNewsController = async (req, res) => {
  try {
    const news = await getAllNews();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getNewsByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;
    const news = await getNewsByCategory(category);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
