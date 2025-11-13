import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

const submitPayment = async (userId, courseId, amount, paymentScreenshot, transactionId) => {
  // Check if user exists
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
    amount,
    paymentScreenshot,
    transactionId,
    status: "pending"
  });

  await newPayment.save();
  return newPayment;
};

const approvePayment = async (paymentId, adminId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "pending") {
    throw new Error("Payment already processed");
  }

  // Update payment status
  payment.status = "approved";
  payment.approvedBy = adminId;
  payment.approvedAt = new Date();
  await payment.save();

  // Enroll user in course
  const user = await User.findById(payment.userId);
  if (!user.coursesEnrolled.includes(payment.courseId)) {
    user.coursesEnrolled.push(payment.courseId);
    await user.save();
  }

  return payment;
};

const rejectPayment = async (paymentId, adminId, rejectionReason) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "pending") {
    throw new Error("Payment already processed");
  }

  payment.status = "rejected";
  payment.rejectionReason = rejectionReason;
  payment.approvedBy = adminId;
  payment.approvedAt = new Date();
  await payment.save();

  return payment;
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
    .populate("approvedBy", "name email")
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