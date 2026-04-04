import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:3000", 
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
  })
);
app.use(express.json());

// 👉 Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// 🔌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/proposal", proposalRoutes);
app.use("/api/payments", paymentRoutes);

// 🏓 Health check
app.get("/", (req, res) => res.json({ msg: "UniHire API is running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));