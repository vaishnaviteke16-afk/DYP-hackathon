import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Higher timeout for reliability
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });

    console.log(`📨 Preparation for mailing to: ${to}`);
    
    await transporter.sendMail({
      from: `"UniHire" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    return true;
  } catch (err) {
    console.error(`📫 SMTP Transfer Error to ${to}:`, err.message);
    throw err; // Propagate to jobNotifications for results logging
  }
};

export default sendEmail;