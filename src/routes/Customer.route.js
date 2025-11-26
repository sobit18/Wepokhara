import express from "express";
import CustomerController from "../controllers/customer.controller.js";

import { body, param } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.post(
  "/registeruser",
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("name sould be atleast 3 character"),
  body("email").isEmail().withMessage("email doesnot have valid address"),
  body("password").isLength({ min: 5 }),
  CustomerController.registerUser
);

router.post(
  "/verifyotp",
  body("email").isEmail().withMessage("email doesnot have valid address"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("otp must be of 6 digits"),
  CustomerController.verifyOtp
);


export default router;
