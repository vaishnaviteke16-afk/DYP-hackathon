import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Middleware to check if user is logged in
export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }

  // Handle "Bearer <token>" or just "<token>"
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized, user not found" });
    }
    
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Not authorized, token failed" });
  }
};

// 👑 Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Not authorized as an admin" });
  }
};

// 💼 Middleware to check if user is client
export const client = (req, res, next) => {
  if (req.user && req.user.role === "client") {
    next();
  } else {
    res.status(403).json({ msg: "Not authorized as a client" });
  }
};

// 🎓 Middleware to check if user is student
export const student = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ msg: "Not authorized as a student" });
  }
};
