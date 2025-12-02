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

  loginUser = asyncHandler(async (req, res, next) => {
    const errors =validationResult(req)
    if(!errors.isEmpty()){
        return next(new ApiError(400,"invalid email or password"))
    }
    const result = await CustomerService.login(req.body);
    res.cookie("authToken", result.authToken, options);
    res.cookie("refreshToken", result.refreshToken, options);
    res.status(200).json(new ApiResponse(200, "user login successfully"));
  });
 
   forgetPassword = asyncHandler(async (req, res, next) => {
    const errors =validationResult(req)
    if(!errors.isEmpty){
        return next(new ApiError(400,"email is required"))
    }
    const result = await CustomerService.forgetPassword(req.body);

    res.status(200).json(new ApiResponse(200, "email sent ", result));
  });

   resetPassword = asyncHandler(async (req, res, next) => {
      const errors =validationResult(req);
    if(!errors.isEmpty){
        return next(new ApiError(400,"token and new password are required"))
    }
    const result = await CustomerService.resetPassword({ ...req.params, ...req.body} );

    res
      .status(200)
      .json(new ApiResponse(200, "password reset successfully", result));
  });
}
export default new CustomerController();
