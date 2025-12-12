import express from 'express';
import { upload } from '../middlewares/multerMiddleware.js';
import {
  submitPayment,
  approvePayment,
  rejectPayment,
  getPendingPayments,
  getUserPayments,
  getPaymentById,
  getAllPayments,
  getPaymentStats
} from '../controllers/paymentController.js';
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/submit/:courseId', upload.single('paymentScreenshot'), authenticate, submitPayment);
router.get('/my-payments', getUserPayments);
router.get('/:paymentId', getPaymentById);

// Admin routes (require admin authentication)
router.get('/admin/pending', getPendingPayments);
router.get('/admin/all', getAllPayments);
router.get('/admin/stats', getPaymentStats);
router.put('/admin/approve/:paymentId', approvePayment);
router.put('/admin/reject/:paymentId', rejectPayment);

export default router;