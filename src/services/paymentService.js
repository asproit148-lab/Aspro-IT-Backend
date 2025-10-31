import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import User from "../models/userModel.js";

export const createOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, // amount in paise
    currency,
    receipt: `receipt_ ${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  return order;
};

export const verifyPayment = async (paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

// Example to enroll course after success
export const markCourseEnrolled = async (userId, courseId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.courseEnrolled = courseId;
  await user.save();
  return user;
};
