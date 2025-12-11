import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import AdminSevice from "../service/Admin.sevice.js";
import { options } from "../config/cookie.config.js";


class AdminController {
  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "email and password are required"));
    }

    const admin = await AdminSevice.login(email, password);

    const authToken = admin.generateAuthToken();
    const refreshToken = admin.generateRefreshToken();

    res
      .cookie("authToken", authToken,options) // 1 day
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }); // 7 days

    res.status(200).json(
      new ApiResponse(200, "Login successful", {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        authToken: authToken,
      })
    );
  });

  changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user._id;

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Old and new passwords are required");
    }

    const result = await AdminSevice.changePassword(adminId, oldPassword, newPassword);
    res.status(200).json(new ApiResponse(200, result.message));
  });
  
  
  changeEmail = asyncHandler(async (req, res, next) => {
    const { password, newEmail } = req.body;
    const adminId = req.user._id;

    if (!password || !newEmail) {
      throw new ApiError(400, "Password and new email are required");
    }

    const result = await AdminSevice.changeEmail(adminId, password, newEmail);
    res.status(200).json(new ApiResponse(200, result.message));
  });

  logout = asyncHandler(async (req, res, next) => {
    res.clearCookie("authToken", options);
    res.clearCookie("refreshToken", options);
    res.status(200).json(new ApiResponse(200, "Admin logged out successfully"));
  });
}

export default new AdminController();
