import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect, client } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧪 GET /api/payments/ping
router.get("/ping", (req, res) => res.json({ msg: "Payment API reachable" }));

// 🔑 GET /api/payments/key
router.get("/key", protect, (req, res) => res.json({ key: process.env.RAZORPAY_KEY_ID }));

// 💳 POST /api/payments/create-order
router.post("/create-order", protect, client, createOrder);

// 💳 POST /api/payments/verify
router.post("/verify", protect, client, verifyPayment);

export default router;
