import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["student", "client", "admin"],
    default: "student"
  },

  college: String,
  skills: [String],

  collegeId: String,
  isVerified: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", userSchema);

export default User;