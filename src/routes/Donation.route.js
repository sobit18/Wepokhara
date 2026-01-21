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
router.get("/approved", verifyToken, getApprovedDonationsController);
router.get("/", verifyToken, authorize(["admin"]), getAllDonationsController);
router.get("/:id", verifyToken, getDonationByIdController);
router.patch("/:id/status", verifyToken, authorize(["admin"]), updateDonationStatusController);
router.delete("/:id", verifyToken, authorize(["admin"]), deleteDonationController);

export default router;
