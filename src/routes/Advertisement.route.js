import express from "express";
import { createAdController, getAllAdsController, getAdByIdController, updateAdController, deleteAdController } from "../controllers/advertisement.controller.js";
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/", upload.single("photo"), createAdController);


export default router;
