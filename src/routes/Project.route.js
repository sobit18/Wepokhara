import express from "express";
import { createProjectController, getAllProjectsController, deleteProjectController } from "../controllers/project.controller.js";
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/", upload.single("image"), createProjectController);
router.get("/", getAllProjectsController);


export default router;
