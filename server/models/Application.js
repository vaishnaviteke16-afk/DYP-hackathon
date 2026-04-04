import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "escrow", "completed", "approved", "released"],
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate applications — one student per job
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
