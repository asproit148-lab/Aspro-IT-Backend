// services/emailService.js
import nodemailer from "nodemailer";

// Create Transporter (works on RENDER)
export function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,            // Render requires this
    secure: false,        // IMPORTANT: Gmail + Render must use false
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

// Send Email
export async function sendEmail(transporter, { to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      info,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
