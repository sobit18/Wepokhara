import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.utils.js";

class AdminService {
  async login(email, password) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError(401, "Invalid credentials");

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    return admin;
  }

  async changePassword(adminId, oldPassword, newPassword) {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) throw new ApiError(401, "Incorrect old password");

    admin.password = newPassword;
    await admin.save();
    return { message: "Password updated successfully" };
  }

  
}
export default new AdminService();
