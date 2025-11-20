import { sendEmail } from "../services/emailService.js";
import { createTransporter } from '../utils/sendEmail.js';

// Enquiry Form
const EnquiryForm = async (req, res) => {
  const { name, email, phone_no, course_name, Mode_of_training } = req.body;

  if (!name || !email || !phone_no || !course_name || !Mode_of_training) {
    return res.status(400).json({ error: "please provide all fields" });
  }

  const transporter = createTransporter();

  const info = await sendEmail(transporter, {
    to: email,
    subject: "You have received a new enquiry form submission",
    text: `Full Name: ${name}
Email: ${email}
Phone: ${phone_no}
Course Name: ${course_name}
Mode of Training: ${Mode_of_training}
Date & Time: ${new Date().toLocaleString()}`,
  });

  return res.json({ ok: true, info });
};

// Contact Form
const ContactForm = async (req, res) => {
  const { name, phone_no, message } = req.body;

  if (!name || !phone_no || !message) {
    return res.status(400).json({ error: "please provide all fields" });
  }

  const transporter = createTransporter();

  const info = await sendEmail(transporter, {
    to: process.env.EMAIL_USER,
    subject: "You have received a new contact form submission",
    text: `Full Name: ${name}
Phone: ${phone_no}
Message: ${message}
Date & Time: ${new Date().toLocaleString()}`,
  });

  return res.json({ ok: true, info });
};

// Enrollment Form (timing removed)
const EnrollmentForm = async (req, res) => {
  const { name, email, address, state, zip_code, course_name, Mode_of_training, batch_type, phone_no } = req.body;

  if (!name || !email || !address || !state || !zip_code || !course_name || !Mode_of_training || !batch_type || !phone_no) {
    return res.status(400).json({ error: "please provide all fields" });
  }

  const transporter = createTransporter();

  const info = await sendEmail(transporter, {
    to: email,
    subject: "You have received a new enrollment form submission",
    text: `Full Name: ${name}
Email: ${email}
Address: ${address}
State: ${state}
Zip Code: ${zip_code}
Course Name: ${course_name}
Mode of Training: ${Mode_of_training}
Batch Type: ${batch_type}
Phone: ${phone_no}
Date & Time: ${new Date().toLocaleString()}`,
  });

  return res.json({ ok: true, info });
};

export { EnquiryForm, ContactForm, EnrollmentForm };