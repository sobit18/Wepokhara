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
  async verifyOtp({ email, otp }) {
    if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

    const user = await User.findOne({ email, isVerifiedEmail: false });
    if (!user) throw new ApiError(404, "User not found");

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    console.log("otpHash is", otpHash);

    const otps = await Otp.findOne({ otpHash });

    if (!otps?.otpHash) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    user.isVerifiedEmail = true;
    await Otp.findOneAndDelete({ otpHash });
    await user.save();

    return { message: "Email verified successfully" };
  }
    async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(400, "Invalid credentials");
    }
    if (user && !user.isVerifiedEmail) {
      throw new ApiError(404, "email is not verified");
    }
    const token = await user?.generateAuthToken();
    const refreshToken = await user?.generateRefreshToken();
    return { authToken: token, refreshToken, role: user?.role };
  }

  async forgetPassword({ email }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("resetToken is", resetToken);

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    console.log("hashed token is", hashedToken);
    await user.save();
    console.log("saved user", user);

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

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
       <p>Hello ${user.fullName},</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return { message: "password reset link sent to email" };
  }
   async resetPassword({ token, password }) {
    console.log("entered token is", token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("token sfter hashed", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new ApiError(400, "invalid or expire token");
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successfully" };
  }

 
}
export default new CustomerService();
