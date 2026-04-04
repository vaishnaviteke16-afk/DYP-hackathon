import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ SIGNUP WITH FILE
router.post("/signup", upload.single("collegeId"), async (req, res) => {
  try {
    const { name, email, password, role, college, skills } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      college,
      skills: skills ? JSON.parse(skills) : [],
      collegeId: req.file ? req.file.path : "",
    });

    res.json({ msg: "Signup successful", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        college: user.college,
        skills: user.skills,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 👤 GET LOGGED-IN USER PROFILE
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 👤 UPDATE LOGGED-IN USER PROFILE
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, college, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (college) user.college = college;
    if (skills) user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 👑 ADMIN: GET ALL USERS
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 👑 ADMIN: VERIFY A STUDENT
router.put("/verify/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User verified", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 👑 ADMIN: DELETE A USER
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;