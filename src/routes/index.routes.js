import express from "express";

const router = express.Router();

import adminRouter from "./Admin.route.js"
import customerRouter from "./Customer.route.js"
// import vendorRouter from "./Vendor.route.js"

router.use("/admin",adminRouter)
router.use("/customer",customerRouter)





// Health check route
// router.get("/health", (req, res) => {
//   res.status(200).json({
//     message: "Health Check",
//   });
// });

export default router;

