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

  
}
export default new AdminService();
