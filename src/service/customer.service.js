import User from "../models/User.js";
import ApiError from "../utils/ApiError.utils.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";

class CustomerService {
  async registeruser({ fullName, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerifiedEmail) {
      throw new ApiError(400, "Email already exists");
    }

    const otpHash = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = Date.now() + 10 * 60 * 1000;

    if (existingUser && !existingUser.isVerifiedEmail) {
      existingUser.password = password || existingUser.password;
      existingUser.fullName = fullName || existingUser.fullName;
      await existingUser.save();
    } else {
      const user = new User({
        fullName,
        email,
        password,
      });
      await user.save();

      await Otp.deleteMany({ userId: user._id });

      const newOtp = new Otp({
        userId: user._id,
        otpHash,
        otpExpires,
      });
      await newOtp.save();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"EVENT MANAGEMENT" <sobitshakya5@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hello ${fullName},</p>
        <p>Your verification code is <b>${otpHash}</b>.</p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
    return { message: "OTP sent to your email", email };
  }

 
}
export default new CustomerService();
