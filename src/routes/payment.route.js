import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order/:course_id", authenticate, createOrder);
router.post("/verify", verifyPayment);

export default router;
