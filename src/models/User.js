import mongoose from "mongoose";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"], // modify roles as needed
      default: "user",
    },
    phone: {
      type: String,
    },
    school: {
      type: String,
    },
    ward: {
      type: String,
    },
    job: {
      type: String,
    },
    profilePicture: String,
  },
  { timestamps: true }
);

// Hash Password Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

// Compare Password Method
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Generate JWT Auth Token
userSchema.methods.generateAuthToken = function (linkId) {
  const payload = {
    _id: this._id,
    role: this.role || "user",
  };

  if (linkId) {
    payload.linkId = linkId;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// Generate Reset Token (6-digit code)
userSchema.methods.generateResetToken = function () {
  return crypto.randomBytes(32).toString("hex").slice(0, 6);
};

// Create User Model
const User = mongoose.model("User", userSchema);

export default User;
