import nodemailer from "nodemailer";

// create transporter (synchronous)
export function createTransporter() {
    const port = Number(process.env.EMAIL_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT), 
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  return transporter;
}

// send email
export async function sendEmail(transporter, { to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: `"Your OTP" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });

  return info;
}
