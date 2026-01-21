import express from "express";

const router = express.Router();

import adminRouter from "./Admin.route.js"
import customerRouter from "./Customer.route.js"
// import vendorRouter from "./Vendor.route.js"

router.use("/admin",adminRouter)
router.use("/customer",customerRouter)

import newsRouter from "./News.route.js"
router.use("/news", newsRouter)

import eventRouter from "./Event.route.js"
router.use("/event", eventRouter)

import projectRouter from "./Project.route.js"
router.use("/project", projectRouter)

import emergencyRouter from "./Emergency.route.js"
router.use("/emergency", emergencyRouter)

import notificationRouter from "./Notification.route.js"
router.use("/notification", notificationRouter)

import advertisementRouter from "./Advertisement.route.js"
router.use("/advertisement", advertisementRouter)

import donationRouter from "./Donation.route.js"
router.use("/donation", donationRouter)





// Health check route
// router.get("/health", (req, res) => {
//   res.status(200).json({
//     message: "Health Check",
//   });
// });

export default router;

