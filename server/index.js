import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);
app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);