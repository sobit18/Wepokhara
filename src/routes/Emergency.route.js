import express from "express";
import EmergencyController from "../controllers/emergency.controller.js";

const router = express.Router();

router.post("/", EmergencyController.createEmergency);

export default router;
