import express from "express";
import { createEventController, getPendingEventsController, getApprovedEventsController, deleteEventController, updateEventController, getEventsByWardController } from "../controllers/event.controller.js";
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/", upload.single("image"), createEventController);


export default router;
