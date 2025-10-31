import Course from '../models/courseModel.js'
import * as paymentService from "../services/paymentService.js";

export const createOrder = async (req, res) => {
  try {
    const userId=req.user?._id;
    const {course_id} = req.params;

     if (!userId || !course_id) {
      return res.status(400).json({ success: false, message: "User ID and Course ID are required" });
    }

    const course = await Course.findById(course_id);

    console.log(course)

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const order = await paymentService.createOrder(course.discountedPrice);
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const isValid = await paymentService.verifyPayment(req.body);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Optional: Enroll course after success
    // await paymentService.markCourseEnrolled(req.user._id, req.body.courseId);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
