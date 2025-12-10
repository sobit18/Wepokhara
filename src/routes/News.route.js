import express from "express";
import { createNewsController, getAllNewsController, getNewsByCategoryController, updateNewsController, deleteNewsController, getNewsByWardController } from "../controllers/news.controller.js";
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/", upload.single("image"), createNewsController);


export default router;
