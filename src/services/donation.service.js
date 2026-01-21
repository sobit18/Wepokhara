import Donation from "../models/Donation.js";

export const createDonation = async (data) => {
  return await Donation.create(data);
};
