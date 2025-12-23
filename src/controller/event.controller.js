import { createEvent, getEventsByStatus, deleteEvent, updateEvent, getEventsByWard } from "../services/event.service.js";

export const createEventController = async (req, res) => {
  try {
    const { eventName, description, location, startDate, endDate, status, ward, userId } = req.body;
    const image = req.file ? req.file.path : null;

    const event = await createEvent({
      eventName,
      description,
      location,
      startDate,
      endDate,
      status, 
      image,
      ward,
      userId,
    });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingEventsController = async (req, res) => {
  try {
    const events = await getEventsByStatus("pending");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getApprovedEventsController = async (req, res) => {
  try {
    const events = await getEventsByStatus("approved");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


