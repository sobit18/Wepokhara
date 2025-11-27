import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import CustomerService from "../service/customer.service.js";
import { options } from "../config/cookie.config.js";
import { validationResult } from "express-validator";

class CustomerController {
  registerUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Name ,Email and Password are required"));
    }
    const user = await CustomerService.registeruser(req.body);
    res
      .status(200)
      .json(new ApiResponse(200, "user registered successfully", user));
  });

   verifyOtp = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ApiError(400, "email and otp is requiered for email verification")
      );
    }
    const result = await CustomerService.verifyOtp(req.body);
    res
      .status(200)
      .json(new ApiResponse(200, "email verified successfully", result));
  });

 
}
export default new CustomerController();
