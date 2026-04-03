import express from "express";
import upload from "../middleware/upload.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔐 Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// 📤 Upload College ID
router.post(
  "/upload-id",
  auth,
  upload.single("collegeId"),
  async (req, res) => {
    try {
      const filePath = req.file.path;

      await User.findByIdAndUpdate(req.user.id, {
        collegeId: filePath
      });

      res.json({
        msg: "File uploaded successfully",
        filePath
      });
    } catch (err) {
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);

export default router;