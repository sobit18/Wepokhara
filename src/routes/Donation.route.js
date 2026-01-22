import express from "express";
import { 
  createDonationController, 
  getAllDonationsController, 
  getDonationByIdController, 
  updateDonationStatusController, 
  deleteDonationController,
  getPendingDonationsController,
  getApprovedDonationsController
} from "../controllers/donation.controller.js";
import { upload } from "../middleware/multerConfig.js";

import { verifyToken, authorize } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("photo"), createDonationController);
router.get("/pending", verifyToken, authorize(["admin"]), getPendingDonationsController);


export default router;
