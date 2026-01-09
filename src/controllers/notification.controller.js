import Notification from "../models/Notification.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.utils.js";
import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

class NotificationController {
  sendGlobalNotification = asyncHandler(async (req, res, next) => {
    const { title, message } = req.body;

    if (!title || !message) {
      throw new ApiError(400, "Title and Message are required");
    }

    // Find all users
    const users = await User.find({});

    if (!users || users.length === 0) {
      throw new ApiError(404, "No users found in the system");
    }

    const recipientIds = [];
    let emailCount = 0;

    // Send email to each user
    // Note: In production, this heavily relies on a queue system (e.g., BullMQ, RabbitMQ)
    // Sending to all users in a loop will time out for large user bases.
    for (const user of users) {
      if (user.email) {
        const emailSent = await sendEmail(
          user.email,
          title,
          `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
            <h2 style="color: #333;">${title}</h2>
            <p>${message}</p>
            <hr>
            <p style="font-size: 0.8em; color: #555;">This is a notification from WePokhara.</p>
          </div>
          `
        );

        if (emailSent) {
          recipientIds.push(user._id);
          emailCount++;
        }
      }
    }

    // Create Notification record
    const notification = new Notification({
      title,
      message,
      sentTo: recipientIds,
      sentCount: emailCount,
    });

    await notification.save();

    res.status(201).json(
      new ApiResponse(201, "Global notification sent", {
        notificationId: notification._id,
        sentCount: emailCount,
        totalUsers: users.length,
      })
    );
  });
   updateNotification = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, message } = req.body;

    if (!title && !message) {
      throw new ApiError(400, "At least one field (Title or Message) is required for update");
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (message) updatedData.message = message;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    res.status(200).json(
      new ApiResponse(200, "Notification updated successfully", notification)
    );
  });

   deleteNotification = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    res.status(200).json(
      new ApiResponse(200, "Notification deleted successfully")
    );
  });
  
}

export default new NotificationController();
