import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    sentTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sentCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Emergency = mongoose.model("Emergency", emergencySchema);

export default Emergency;
