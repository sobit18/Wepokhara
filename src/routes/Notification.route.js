import express from "express";
import NotificationController from "../controllers/notification.controller.js";

import { verifyToken, authorize } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

router.post("/", verifyToken, authorize(["admin"]), NotificationController.sendGlobalNotification);
router.patch("/:id", verifyToken, authorize(["admin"]), NotificationController.updateNotification);


export default router;
