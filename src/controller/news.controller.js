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
export const getNewsByWardController = async (req, res) => {
  try {
    const { ward } = req.params;
    const news = await getNewsByWard(ward);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateNewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, ward, userId } = req.body;
    let updateData = { title, content, category, ward, userId };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedNews = await updateNews(id, updateData);
    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News updated successfully", news: updatedNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};