import express from "express";
import { createNewsController, getAllNewsController, getNewsByCategoryController, updateNewsController, deleteNewsController, getNewsByWardController } from "../controller/news.controller.js";
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/", upload.single("image"), createNewsController);
router.get("/", getAllNewsController);
router.get("/category/:category", getNewsByCategoryController);
router.get("/ward/:ward", getNewsByWardController);
router.put("/:id", upload.single("image"), updateNewsController);

export default router;
