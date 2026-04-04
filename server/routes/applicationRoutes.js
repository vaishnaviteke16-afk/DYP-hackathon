import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { protect, student, client, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// 🎓 STUDENT: Apply to a job  POST /api/applications/:jobId
// ─────────────────────────────────────────────
router.post("/:jobId", protect, student, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { message } = req.body;

    // Check job exists and is open
    const job = await Job.findById(jobId).populate("postedBy");
    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (job.status === "closed")
      return res.status(400).json({ msg: "This job is no longer accepting applications" });

    // 🚫 Duplicate check (also enforced at DB level by unique index)
    const existing = await Application.findOne({
      job: jobId,
      student: req.user._id,
    });
    if (existing)
      return res.status(400).json({ msg: "You have already applied to this job" });

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
      message: message || "",
    });

    // 💬 Create/Find Conversation between Student and Client for this Job
    let conversation = await Conversation.findOne({
      job: jobId,
      participants: { $all: [req.user._id, job.postedBy._id] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        job: jobId,
        participants: [req.user._id, job.postedBy._id],
      });
    }

    // ✉️ Create the initial application message
    const initialMsg = await Message.create({
      sender: req.user._id,
      conversation: conversation._id,
      text: message || "I am interested in this gig!",
    });

    conversation.lastMessage = initialMsg._id;
    await conversation.save();

    res.status(201).json({ msg: "Application submitted and conversation started", application });
  } catch (err) {
    // Handle MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ msg: "You have already applied to this job" });
    }
    console.error(err);
    res.status(500).json({ msg: "Error submitting application" });
  }
});

// ─────────────────────────────────────────────
// 🎓 STUDENT: Get my applications  GET /api/applications/my
// ─────────────────────────────────────────────
router.get("/my", protect, student, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("job", "title description skillsRequired budget deadline postedBy status")
      .populate({
        path: "job",
        populate: { path: "postedBy", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching applications" });
  }
});

// ─────────────────────────────────────────────
// 💼 CLIENT: Get all applicants for one of their jobs  GET /api/applications/job/:jobId
// ─────────────────────────────────────────────
router.get("/job/:jobId", protect, client, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // 🔒 Only the job owner can see applicants
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("student", "name email skills college isVerified")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching applicants" });
  }
});

// ─────────────────────────────────────────────
// 👑 ADMIN: Get ALL applications  GET /api/applications/admin/all
// ─────────────────────────────────────────────
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title")
      .populate("student", "name email college")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all applications" });
  }
});

// ─────────────────────────────────────────────
// 💼 CLIENT: Accept or Reject application  PUT /api/applications/:id/status
// ─────────────────────────────────────────────
router.put("/:id/status", protect, client, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id).populate(
      "job"
    );
    if (!application)
      return res.status(404).json({ msg: "Application not found" });

    // 🔒 Only the job owner (or Admin) can update application status
    if (
      req.user.role !== "admin" &&
      application.job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    application.status = status;
    if (!application.paymentStatus) application.paymentStatus = "pending";
    await application.save();

    res.json({ msg: `Application ${status}`, application });
  } catch (err) {
    res.status(500).json({ msg: "Error updating application status" });
  }
});

// ─────────────────────────────────────────────
// 🎓 STUDENT: Mark project as COMPLETED (moves to 'completed' status)
// ─────────────────────────────────────────────
router.put("/:id/complete", protect, student, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ msg: "Application not found" });

    // Ensure only the assigned student can mark as complete
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (application.paymentStatus !== "escrow") {
      return res.status(400).json({ msg: "Project must be in escrow to mark as completed" });
    }

    application.paymentStatus = "completed";
    await application.save();

    res.json({ msg: "Project marked as completed, awaiting client approval", application });
  } catch (err) {
    res.status(500).json({ msg: "Error marking project as completed" });
  }
});

// ─────────────────────────────────────────────
// 💼 CLIENT: Approve work and RELEASE funds
// ─────────────────────────────────────────────
router.put("/:id/approve", protect, client, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ msg: "Application not found" });

    // Only job owner can approve
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (application.paymentStatus !== "completed") {
      return res.status(400).json({ msg: "Project must be marked completed by the student first" });
    }

    application.paymentStatus = "approved";
    // For dummy purposes, we move to 'released' immediately after approval
    application.paymentStatus = "released";
    await application.save();

    res.json({ msg: "Funds released to student successfully", application });
  } catch (err) {
    res.status(500).json({ msg: "Error releasing funds" });
  }
});

export default router;
