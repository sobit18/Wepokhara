import mongoose, { Schema } from "mongoose";
import User from "./User.js";
import crypto from "crypto"
const otpSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  otpHash: {
    type: String,
  },

  otpExpires: {
    type: Date,
  },
});

otpSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otpHash")) {
    return next();
  }
  this.otpHash = crypto.createHash("sha256").update(this.otpHash).digest("hex");
  next();
});
const Otp = new mongoose.model("Otp", otpSchema);
export default Otp;
