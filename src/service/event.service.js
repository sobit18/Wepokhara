import Event from "../models/Event.js";

export const createEvent = async (data) => {
  return await Event.create(data);
};

export const getEventsByStatus = async (status) => {
  return await Event.find({ status }).sort({ createdAt: -1 });
};

export const getEventsByWard = async (ward) => {
  return await Event.find({ ward }).sort({ createdAt: -1 });
};

export const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};

export const updateEvent = async (id, data) => {
  return await Event.findByIdAndUpdate(id, data, { new: true });
};