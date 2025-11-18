import express from "express";
import AdminController from "../controllers/Admin.controller.js";

import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router=express.Router()
router.post('/login',AdminController.login)



export default router;