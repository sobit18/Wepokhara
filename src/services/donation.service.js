import Donation from "../models/Donation.js";

export const createDonation = async (data) => {
  return await Donation.create(data);
};

export const getDonationsByStatus = async (status) => {
  return await Donation.find({ status }).populate("userId", "fullName email").sort({ createdAt: -1 });
};

export const getAllDonations = async () => {
  return await Donation.find().populate("userId", "fullName email").sort({ createdAt: -1 });
};
