import Emergency from "../models/Emergency.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.utils.js";
import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

class EmergencyController {
  createEmergency = asyncHandler(async (req, res, next) => {
    const { message, ward } = req.body;

    if (!message || !ward) {
      throw new ApiError(400, "Message and Ward are required");
    }

    // Find all users in the specified ward
    const users = await User.find({ ward: ward });

    if (!users || users.length === 0) {
      throw new ApiError(404, `No users found in ward ${ward}`);
    }

    const recipientIds = [];
    let emailCount = 0;

    // Send email to each user
    // Note: In production, this should be handled by a queue system to avoid timeout
    for (const user of users) {
      if (user.email) {
        const emailSent = await sendEmail(
          user.email,
          "EMERGENCY ALERT",
          `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ff0000; border-radius: 5px;">
            <h1 style="color: #ff0000;">EMERGENCY ALERT</h1>
            <p><strong>Ward:</strong> ${ward}</p>
            <p><strong>Message:</strong></p>
            <p style="font-size: 1.2em; font-weight: bold;">${message}</p>
            <hr>
            <p style="font-size: 0.8em; color: #555;">This is an automated emergency message from WePokhara.</p>
          </div>
          `
        );

        if (emailSent) {
          recipientIds.push(user._id);
          emailCount++;
        }
      }
    }

    // Create Emergency record
    const emergency = new Emergency({
      message,
      ward,
      sentTo: recipientIds,
      sentCount: emailCount,
      userId: req.body.userId,
    });

    await emergency.save();

    res.status(201).json(
      new ApiResponse(201, "Emergency broadcast sent", {
        emergencyId: emergency._id,
        sentCount: emailCount,
        totalUsersInWard: users.length,
      })
    );
  });
}

export default new EmergencyController();
