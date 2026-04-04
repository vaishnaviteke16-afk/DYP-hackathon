import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are FreelanceBot, an expert assistant for student freelancers on the VerifiedGigs platform. 
Your role is to:
- Suggest competitive and fair pricing for student freelancers based on their skill level and market rates.
- Write and improve gig descriptions to attract more clients.
- Give actionable skill development tips for high-demand freelance skills.
- Help students build their portfolio and personal brand.
- Provide guidance on client communication, contracts, and project management.
- Share strategies to get first clients and build reviews.
- Advise on balancing freelancing with academics.

Always be encouraging, practical, and student-friendly. Use clear formatting with bullet points or numbered lists where helpful. Keep responses concise but comprehensive.`;

router.post("/", limiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("ChatBot Error:", err);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
});

export default router;
