import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
      required: true,
    },
    targetVotes: {
      type: Number,
      required: true,
    },
    currentVotes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
