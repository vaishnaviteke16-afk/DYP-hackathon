import express from "express";
import { createProposal } from "../controllers/proposalController.js";
import { protect, student } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🚀 POST /api/proposal/generate
// Protected by protect so only logged in users can access
// Further restricted to students
router.post("/generate", protect, student, createProposal);

export default router;
