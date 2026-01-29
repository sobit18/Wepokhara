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


export const getDonationById = async (id) => {
  return await Donation.findById(id).populate("userId", "fullName email");
};

export const updateDonationStatus = async (id, status) => {
  return await Donation.findByIdAndUpdate(id, { status }, { new: true });
};

export const deleteDonation = async (id) => {
  return await Donation.findByIdAndDelete(id);
};
