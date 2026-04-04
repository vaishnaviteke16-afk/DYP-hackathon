import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { protect, client, admin } from "../middleware/authMiddleware.js";
import { notifyMatchedStudents } from "../utils/jobNotifications.js";

const router = express.Router();

// ─────────────────────────────────────────────
// 💼 CLIENT: Create a new job  POST /api/jobs
// ─────────────────────────────────────────────
router.post("/", protect, client, async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    const job = await Job.create({
      title,
      description,
      skillsRequired: skillsRequired || [],
      budget: budget || "",
      deadline: deadline || "",
      postedBy: req.user._id,
    });

    res.status(201).json({ msg: "Job created successfully", job });

    // 📢 Start skill-matching background process
    notifyMatchedStudents(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating job" });
  }
});

// ─────────────────────────────────────────────
// 🎓 STUDENT/ALL: Browse all open jobs  GET /api/jobs
// ─────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    // Attach applicant count to each job
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantCount: count };
      })
    );

    res.json(jobsWithCount);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching jobs" });
  }
});

// ─────────────────────────────────────────────
// 💼 CLIENT: Get their own jobs  GET /api/jobs/my-jobs
// ─────────────────────────────────────────────
router.get("/my-jobs", protect, client, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });

    // Attach full applicant data to each job
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
          .populate("student", "name email skills college isVerified");
        return {
          ...job.toObject(),
          applicants: applications.map((a) => ({
            applicationId: a._id,
            status: a.status,
            paymentStatus: a.paymentStatus || "pending",
            message: a.message,
            appliedAt: a.createdAt,
            ...a.student.toObject(),
          })),
        };
      })
    );

    res.json(jobsWithApplicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching your jobs" });
  }
});

// ─────────────────────────────────────────────
// 👑 ADMIN: Get ALL jobs  GET /api/jobs/admin/all
// ─────────────────────────────────────────────
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id }).populate(
          "student",
          "name email"
        );
        return {
          ...job.toObject(),
          applications,
        };
      })
    );

    res.json(jobsWithDetails);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all jobs" });
  }
});

// ─────────────────────────────────────────────
// 📄 Get single job  GET /api/jobs/:id
// ─────────────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching job" });
  }
});

// ─────────────────────────────────────────────
// ✏️ CLIENT: Update own job  PUT /api/jobs/:id
// ─────────────────────────────────────────────
router.put("/:id", protect, client, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // 🔒 Ownership check
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to edit this job" });
    }

    const { title, description, skillsRequired, budget, deadline, status } =
      req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (skillsRequired) job.skillsRequired = skillsRequired;
    if (budget) job.budget = budget;
    if (deadline) job.deadline = deadline;
    if (status) job.status = status;

    await job.save();
    res.json({ msg: "Job updated", job });
  } catch (err) {
    res.status(500).json({ msg: "Error updating job" });
  }
});

// ─────────────────────────────────────────────
// 🗑️ CLIENT: Delete own job  DELETE /api/jobs/:id
// ─────────────────────────────────────────────
router.delete("/:id", protect, client, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // 🔒 Ownership check (Admin bypasses this)
    if (
      req.user.role !== "admin" &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    // Also remove all applications for this job
    await Application.deleteMany({ job: req.params.id });

    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting job" });
  }
});

export default router;