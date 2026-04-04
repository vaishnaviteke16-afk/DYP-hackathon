import User from "../models/User.js";
import sendEmail from "./sendEmail.js";

/**
 * 📢 Notifies students whose skills match the new job's requirements.
 * This runs asynchronously to avoid blocking the main API response.
 */
export const notifyMatchedStudents = async (job) => {
  try {
    const { title, description, skillsRequired, _id } = job;
    
    if (!skillsRequired || skillsRequired.length === 0) {
      console.log(`⚠️ No skills required for job ${title}, skipping notifications.`);
      return;
    }

    // 🕵️ Case-insensitive matching: convert all required skills to lowercase for the query
    const lowerRequired = skillsRequired.map(s => s.toLowerCase());

    console.log(`🔍 Scanning for students matching: [${skillsRequired.join(", ")}]...`);

    // 🔍 Find students (MongoDB $in is case-sensitive, so we'll fetch then filter or use regex)
    // For simplicity with $in, we fetch students and filter in JS if the student base is manageable.
    // Or we can use $regex for each skill (better for scale).
    
    const regexList = lowerRequired.map(s => new RegExp(`^${s}$`, "i"));

    const matchedStudents = await User.find({
      role: "student",
      skills: { $in: regexList }
    }).select("name email");

    if (matchedStudents.length === 0) {
      console.log(`📭 No matching students found for skills.`);
      return;
    }

    console.log(`🔔 Found ${matchedStudents.length} matches for job: ${title}`);
    
    // ... sending logic ...

    // 📧 Send personalized emails
    const emailPromises = matchedStudents.map(student => {
      const subject = `🚀 New Gig Alert: ${title}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb;">New Opportunity Matching Your Skills!</h2>
          <p>Hi <strong>${student.name}</strong>,</p>
          <p>A new job matching your profile has just been posted on <strong>UniHire</strong>:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${title}</h3>
            <p style="font-size: 14px; color: #475569;">${description.substring(0, 150)}...</p>
            <p><strong>Required Skills:</strong> ${skillsRequired.join(", ")}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:5173/project/${_id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
               View & Apply Now
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">You received this because of your skill profile on UniHire.</p>
        </div>
      `;

      const text = `Hi ${student.name}, a new job matching your skills was posted: ${title}. Details: ${description.substring(0, 100)}. View at: http://localhost:5173/project/${_id}`;

      return sendEmail(student.email, subject, text, html);
    });

    // We use Promise.allSettled to ensure one failed email doesn't stop others
    const results = await Promise.allSettled(emailPromises);
    
    results.forEach((res, i) => {
      if (res.status === "rejected") {
        console.error(`❌ Failed to notify ${matchedStudents[i].email}:`, res.reason);
      } else {
        console.log(`✅ Notified ${matchedStudents[i].email}`);
      }
    });

    console.log(`📡 Full dispatch cycle complete for: ${title}`);

  } catch (err) {
    console.error("❌ Error in job notification system:", err);
  }
};
