import { sendEmail,createTransporter } from "../services/emailService.js";
import { generateOTP, hashOTP, expiryMinutesFromNow } from "../utils/otp.js";
import Otp from "../models/otpModel.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

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

export const requestEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({email});
    if (!user) return res.status(400).json({ error: "User with this email does not exist" });

    const otp = generateOTP(6);
    const salt =8;
    const otpHash = await bcrypt.hash(otp, salt);
    const expiresAt = expiryMinutesFromNow(5);

   user.otp = otpHash;
    user.otpExpiry = expiresAt;
    await user.save();

    const transporter = createTransporter();
    await sendEmail(transporter, {
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return res.status(200).json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in requestEmailOtp:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP required" });

    const user = await User.findOne({email});
    if (!user) return res.status(400).json({ error: "User with this email does not exist" });

    if(!user.otp || !user.otpExpiry)
      return res.status(400).json({ error: "No OTP found or expired" });

     const isValidOtp= await bcrypt.compare(otp,user.otp);
    const isOtpExpired= Date.now() > user.otpExpiry;

    if (!isValidOtp) 
      return res.status(400).json({ error: "Invalid OTP" });

    if (isOtpExpired) {
      return res.status(400).json({ error: "OTP expired" });
    }

     user.otp=undefined;
    user.otpExpiry=undefined;
    user.canResetPassword=true;
    await user.save();

    return res.status(200).json({ ok: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in verifyEmailOtp:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { EnquiryForm, ContactForm, EnrollmentForm };