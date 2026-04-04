import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

/**
 * 🧪 Database Health Check
 * Verifies if there are any students with roles and skills in the DB.
 */
async function checkStats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const count = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const skilledStudents = await User.find({ role: 'student', skills: { $ne: [] } }).select('name email skills');
    
    console.log("-----------------------------------------");
    console.log(`📊 DB STATS: Total Users: ${count}`);
    console.log(`📊 DB STATS: Students: ${studentCount}`);
    console.log(`📊 DB STATS: Students with skills: ${skilledStudents.length}`);
    console.log("-----------------------------------------");
    
    if (skilledStudents.length > 0) {
      console.log("✅ SAMPLE MATCH TARGETS:");
      skilledStudents.slice(0, 3).forEach(s => {
        console.log(` - ${s.name} (${s.email}): [${s.skills.join(", ")}]`);
      });
    } else {
      console.log("⚠️ WARNING: No students found with skills! Notifications will never trigger.");
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ DB Check Failed:", err.message);
  }
}

checkStats();
