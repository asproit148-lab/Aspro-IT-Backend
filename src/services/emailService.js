import dotenv from 'dotenv';
import { Resend } from 'resend';


dotenv.config();

export function createTransporter() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  const resend = new Resend(apiKey);
  return resend;
}

// send email
export async function sendEmail(resend, { to, subject, text, html }) {
  try {
    const info = await resend.emails.send({
      from: process.env.EMAIL_FROM ,
      to,
      subject,
      text,
      html
    });

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
