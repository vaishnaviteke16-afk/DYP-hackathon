import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: false, // 🔥 MADE OPTIONAL FOR DIRECT MESSAGING
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ignored"],
      default: "pending",
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
