import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// 🔍 SEARCH USERS: GET /api/messages/search-users?q=...
// ─────────────────────────────────────────────
router.get("/search-users", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude self
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        },
      ],
    }).select("_id name email role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error while searching users" });
  }
});

// ─────────────────────────────────────────────
// 📱 GET ALL CONVERSATIONS: GET /api/messages/conversations
// ─────────────────────────────────────────────
router.get("/conversations", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "name email role")
      .populate("job", "title status")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name role" }
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ msg: "Server error while fetching conversations" });
  }
});

// ─────────────────────────────────────────────
// 💬 GET MESSAGES BY CONVERSATION: GET /api/messages/:convId
// ─────────────────────────────────────────────
router.get("/:convId", protect, async (req, res) => {
  try {
    const { convId } = req.params;
    const userId = req.user._id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: convId,
      participants: { $in: [userId] },
    });
    if (!conversation) return res.status(403).json({ msg: "Access denied" });

    const messages = await Message.find({ conversation: convId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error while fetching messages" });
  }
});

// ─────────────────────────────────────────────
// ✅ UPDATE CONVERSATION STATUS: PUT /api/messages/:convId/status
// ─────────────────────────────────────────────
router.put("/:convId/status", protect, async (req, res) => {
  try {
    const { convId } = req.params;
    const { status } = req.body; // 'accepted' or 'ignored'
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: convId,
      participants: { $in: [userId] },
    });

    if (!conversation) return res.status(404).json({ msg: "Conversation not found" });

    conversation.status = status;
    await conversation.save();

    res.json({ msg: `Conversation ${status}` });
  } catch (err) {
    res.status(500).json({ msg: "Server error while updating status" });
  }
});

// ─────────────────────────────────────────────
// 📤 SEND MESSAGE: POST /api/messages/:convId
// ─────────────────────────────────────────────
router.post("/:convId", protect, async (req, res) => {
  try {
    const { convId } = req.params;
    const { text, file } = req.body;
    const userId = req.user._id;

    // Find the conversation and verify user is part of it
    const conversation = await Conversation.findOne({
      _id: convId,
      participants: { $in: [userId] },
    });
    if (!conversation) return res.status(403).json({ msg: "Access denied" });

    // 📊 Identify recipient (p can be an ID or a populated object)
    const recipientId = conversation.participants.find(p => {
      const participantId = (p._id || p).toString();
      return participantId !== userId.toString();
    });

    console.log("📨 Sending message from:", userId, "to:", recipientId || "No Recipient");
    
    // 📩 Create message
    const newMessage = await Message.create({
      sender: userId,
      conversation: convId,
      text,
      file,
    });

    conversation.lastMessage = newMessage._id;
    
    // 🚀 Bypass validation using updateOne to prevent 500 errors on legacy documents
    const updateData = { lastMessage: newMessage._id };
    
    if (recipientId) {
      const ridStr = (recipientId._id || recipientId).toString();
      const currentUnread = (conversation.unreadCount?.get?.(ridStr)) || 0;
      updateData[`unreadCount.${ridStr}`] = currentUnread + 1;
    }

    await Conversation.updateOne({ _id: convId }, { $set: updateData });
    console.log("✅ Message saved and Conversation updated (validation bypassed)");

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Send Message Detailed Error:", err);
    res.status(500).json({ 
      msg: "Server error while sending message", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
});

// ─────────────────────────────────────────────
// 📖 MARK AS READ: PATCH /api/messages/:convId/read
// ─────────────────────────────────────────────
router.patch("/:convId/read", protect, async (req, res) => {
  try {
    const { convId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: convId,
      participants: { $in: [userId] },
    });

    if (!conversation) return res.status(404).json({ msg: "Conversation not found" });

    // Reset unread count for current user
    conversation.unreadCount.set(userId.toString(), 0);
    await conversation.save();

    // Optionally mark all messages as read (if isRead is used in UI)
    await Message.updateMany(
      { conversation: convId, sender: { $ne: userId } },
      { $set: { isRead: true } }
    );

    res.json({ msg: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Server error while marking as read" });
  }
});

// ─────────────────────────────────────────────
// 🚀 INITIATE CONVERSATION: POST /api/messages/conversations
// ─────────────────────────────────────────────
router.post("/conversations", protect, async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const userId = req.user._id;

    if (!recipientId) return res.status(400).json({ msg: "Recipient required" });

    // 1. Check if conversation already exists between these two
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (conversation) {
      const populatedExisting = await Conversation.findById(conversation._id)
        .populate("participants", "name email role")
        .populate({
          path: "lastMessage",
          populate: { path: "sender", select: "name role" }
        });
      return res.json(populatedExisting);
    }

    // 2. Create new conversation if not exists
    conversation = await Conversation.create({
      participants: [userId, recipientId],
      status: "pending", // Initial request status
    });

    // 3. Create initial message
    const initialMessage = await Message.create({
      sender: userId,
      conversation: conversation._id,
      text: text || "Hi! I'd like to connect.",
    });

    // 📈 Update conversation meta (bypass validation for direct links)
    const updateData = { 
      lastMessage: initialMessage._id,
      [`unreadCount.${recipientId.toString()}`]: 1 
    };
    
    await Conversation.updateOne({ _id: conversation._id }, { $set: updateData });

    // 5. Populate and return
    const populated = await Conversation.findById(conversation._id)
      .populate("participants", "name email role")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name role" }
      });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Server error while initiating conversation" });
  }
});

export default router;
