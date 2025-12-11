import express from "express";
import AdminController from "../controller/Admin.controller.js";

import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();
router.post("/login", AdminController.login);
router.patch("/change-password", verifyToken, AdminController.changePassword);
router.patch("/change-email", verifyToken, AdminController.changeEmail);
router.post("/logout", verifyToken, AdminController.logout);

export default router;
