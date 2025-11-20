import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";
import {  sendEmail } from "../services/emailService.js";
import {createTransporter} from '../utils/sendEmail.js'
import { generateEnrollmentId } from "../utils/generateEnrollmentId.js";

const submitPayment = async (userId, courseId, paymentScreenshot) => {
 
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Check if user already enrolled
  if (user.coursesEnrolled.includes(courseId)) {
    throw new Error("User already enrolled in this course");
  }
  let paymentImageUrl = null;
  if(paymentScreenshot){
    const uploadResult = await uploadOnCloudinary(paymentScreenshot);
    paymentImageUrl= uploadResult.secure_url;
  }
  // Check if there's already a pending payment
  const existingPayment = await Payment.findOne({
    userId,
    courseId,
    status: "pending"
  });

  if (existingPayment) {
    throw new Error("You already have a pending payment for this course");
  }

  const newPayment = new Payment({
    userId,
    courseId,
    paymentScreenshot: paymentImageUrl,
    status: "pending"
  });

  await newPayment.save();
  return newPayment;
};

const approvePayment = async (paymentId) => {
  // Find payment
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error("Payment not found");
  if (payment.status === "approved") throw new Error("Payment already processed");

  // Update payment status
  payment.status = "approved";
  payment.approvedAt = new Date();
  await payment.save();

  // Find user
  const user = await User.findById(payment.userId);
  if (!user) throw new Error("User not found");

  // Generate enrollment ID
  const enrollmentId = generateEnrollmentId(user._id, payment.courseId);

  // Save enrollment
  const enrollment = await Enrollment.create({
    user: user._id,
    course: payment.courseId,
    enrollmentId,
  });

  // Add to user's coursesEnrolled with enrollmentId
  user.coursesEnrolled.push({
    courseId: payment.courseId,
    enrollmentId,
    enrolledAt: new Date(),
  });
  await user.save();

  // Send email to user
  const transporter = createTransporter();
  const info = await sendEmail(transporter, {
    to: user.email,
    subject: "You have successfully enrolled in the course",
    text: `Dear ${user.name},

Your payment has been approved successfully and your enrollment is confirmed.

Course ID: ${payment.courseId}
Enrollment ID: ${enrollmentId}

You can use this enrollment ID to download your certificate.

For any queries, contact: asproits@gmail.com

Regards,
AsproIT`,
  });

  return { payment, enrollment, info };
};

const rejectPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "pending") {
    throw new Error("Payment already processed");
  }

  payment.status = "rejected";
  payment.approvedAt = new Date();
  await payment.save();
  const user = await User.findById(payment.userId);
const transporter = createTransporter();

  const info = await sendEmail(transporter,{
    to: user.email,
      subject: "You have successfully enrolled in the course",
      text: `Dear [${user.name}],
Thank you for applying to the [${payment.courseId.Course_title}] course. Your payment has FAILED and your enrolment is on hold.
Please try again or let us know if we’ve made a mistake.
Contact: asproits@gmail.com`});
  return {payment,info};
};

const getPendingPayments = async () => {
  const payments = await Payment.find({ status: "pending" })
    .populate("userId", "name email")
    .populate("courseId", "Course_title Course_cost")
    .sort({ createdAt: -1 });

  return payments;
};

const getUserPayments = async (userId) => {
  const payments = await Payment.find({ userId })
    .populate("courseId", "Course_title Course_cost")
    .populate("approvedBy", "name email")
    .sort({ createdAt: -1 });

  return payments;
};

const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("userId", "name email phone_no")
    .populate("courseId", "Course_title Course_cost Course_category")
    .populate("approvedBy", "name email");

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

const getAllPayments = async (status) => {
  const filter = status ? { status } : {};
  
  const payments = await Payment.find(filter)
    .populate("userId", "name email")
    .populate("courseId", "Course_title Course_cost")
    .sort({ createdAt: -1 });

  return payments;
};

const getPaymentStats = async () => {
  const [pending, approved, rejected, totalRevenue] = await Promise.all([
    Payment.countDocuments({ status: "pending" }),
    Payment.countDocuments({ status: "approved" }),
    Payment.countDocuments({ status: "rejected" }),
    Payment.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ]);

  return {
    pending,
    approved,
    rejected,
    totalPayments: pending + approved + rejected,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
  };
};

export default {
  submitPayment,
  approvePayment,
  rejectPayment,
  getPendingPayments,
  getUserPayments,
  getPaymentById,
  getAllPayments,
  getPaymentStats
};