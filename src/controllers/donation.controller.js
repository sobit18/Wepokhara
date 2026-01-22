import { createDonation, getAllDonations, getDonationById, updateDonationStatus, deleteDonation, getDonationsByStatus } from "../services/donation.service.js";

export const createDonationController = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id; // Taken from verifyToken middleware
    const photo = req.file ? req.file.path : null;

    if (!photo) {
      return res.status(400).json({ message: "Photo (receipt/proof) is required" });
    }

    const donation = await createDonation({
      userId,
      amount,
      photo,
    });
    res.status(201).json({ message: "Donation submitted successfully", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingDonationsController = async (req, res) => {
  try {
    const donations = await getDonationsByStatus("pending");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


