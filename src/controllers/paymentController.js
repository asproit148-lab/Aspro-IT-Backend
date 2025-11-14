import paymentService from '../services/paymentService.js';

const submitPayment = async (req, res) => {
  try {
    const userId = req.user?._id; // From auth middleware
    const { courseId } = req.params;
    const paymentScreenshot = req.file?.path; // From multer upload

    if (!userId || !courseId || !paymentScreenshot) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: courseId and payment screenshot"
      });
    }

    const payment = await paymentService.submitPayment(
      userId,
      courseId,
      paymentScreenshot
    );

    return res.status(201).json({
      success: true,
      message: "Payment submitted successfully. Awaiting admin approval.",
      payment
    });
  } catch (err) {
    console.error("Error submitting payment:", err);
    res.status(400).json({ 
      success: false,
      message: err.message || "Failed to submit payment" 
    });
  }
};

const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    

    if (!paymentId) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide paymentId" 
      });
    }

    const payment = await paymentService.approvePayment(paymentId);

    return res.status(200).json({
      success: true,
      message: "Payment approved and user enrolled successfully",
      payment
    });
  } catch (err) {
    console.error("Error approving payment:", err);
    res.status(400).json({ 
      success: false,
      message: err.message || "Failed to approve payment" 
    });
  }
};

const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
   
    if (!paymentId) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide paymentId" 
      });
    }

   

    const payment = await paymentService.rejectPayment(paymentId);

    return res.status(200).json({
      success: true,
      message: "Payment rejected",
      payment
    });
  } catch (err) {
    console.error("Error rejecting payment:", err);
    res.status(400).json({ 
      success: false,
      message: err.message || "Failed to reject payment" 
    });
  }
};

const getPendingPayments = async (req, res) => {
  try {
    const payments = await paymentService.getPendingPayments();

    return res.status(200).json({
      success: true,
      message: "Pending payments fetched successfully",
      count: payments.length,
      payments
    });
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const userId = req.user?._id; // From auth middleware

    const payments = await paymentService.getUserPayments(userId);

    return res.status(200).json({
      success: true,
      message: "User payments fetched successfully",
      count: payments.length,
      payments
    });
  } catch (err) {
    console.error("Error fetching user payments:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide paymentId" 
      });
    }

    const payment = await paymentService.getPaymentById(paymentId);

    return res.status(200).json({
      success: true,
      message: "Payment details fetched successfully",
      payment
    });
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(404).json({ 
      success: false,
      message: err.message || "Payment not found" 
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { status } = req.query; // Optional filter: ?status=approved

    const payments = await paymentService.getAllPayments(status);

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      count: payments.length,
      payments
    });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const getPaymentStats = async (req, res) => {
  try {
    const stats = await paymentService.getPaymentStats();

    return res.status(200).json({
      success: true,
      message: "Payment statistics fetched successfully",
      stats
    });
  } catch (err) {
    console.error("Error fetching payment stats:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

export {
  submitPayment,
  approvePayment,
  rejectPayment,
  getPendingPayments,
  getUserPayments,
  getPaymentById,
  getAllPayments,
  getPaymentStats
};