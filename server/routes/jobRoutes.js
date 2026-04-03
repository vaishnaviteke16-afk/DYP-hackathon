import express from "express";
import Job from "../models/Job.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/create-job", async (req, res) => {
  try {
    const { title, description, skillsRequired } = req.body;

    // Save job
    const job = await Job.create({
      title,
      description,
      skillsRequired
    });

    // Find matching users
    const matchedUsers = await User.find({
      skills: { $in: skillsRequired }
    });

    // Send emails
    for (let user of matchedUsers) {
      await sendEmail(
        user.email,
        "New Freelance Opportunity 🚀",
        `Hi ${user.name},\n\nA new job matches your skills:\n\n${title}\n\n${description}\n\nApply now!`
      );
    }

    res.json({
      msg: "Job created & emails sent",
      matchedUsers: matchedUsers.length
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating job" });
  }
});

export default router;