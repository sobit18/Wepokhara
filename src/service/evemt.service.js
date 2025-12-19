import Event from "../models/Event.js";

export const createEvent = async (data) => {
  return await Event.create(data);
};


