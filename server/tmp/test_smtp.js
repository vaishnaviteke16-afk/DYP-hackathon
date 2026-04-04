import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

/**
 * 🧪 SMTP Diagnostic Script
 * Tests the email credentials in .env by sending a ping to yourself.
 */
async function testSMTP() {
  const target = process.env.EMAIL_USER;
  
  if (!target || !process.env.EMAIL_PASS) {
    console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS missing from your .env file!");
    return;
  }

  console.log(`🔌 Attempting to establish secure link with node: ${target}...`);
  
  try {
    await sendEmail(
      target, 
      "📡 StudentFreelance: SMTP Port Check", 
      "System online. If you receive this, your email configuration is correct.",
      "<h2 style='color: #2563eb;'>Link Established!</h2><p>Your SMTP protocol is correctly configured on the server.</p>"
    );
    console.log("✅ SUCCESS: Transmissions confirmed. Check your inbox.");
  } catch (err) {
    console.error("❌ CRITICAL: SMTP handshake failed.");
    console.log("-----------------------------------------");
    console.log("🔍 DIAGNOSIS:", err.message);
    console.log("-----------------------------------------");
    console.log("💡 Tip: If using Gmail, make sure to use an 'App Password' (not your login password).");
    console.log("   Visit: https://myaccount.google.com/apppasswords");
  }
}

testSMTP();
