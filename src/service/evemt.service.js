import Event from "../models/Event.js";

export const createEvent = async (data) => {
  return await Event.create(data);
};

export const getEventsByStatus = async (status) => {
  return await Event.find({ status }).sort({ createdAt: -1 });
};
