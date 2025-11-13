import express from 'express';
import multer from 'multer';
import path from 'path';
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

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// User routes (require user authentication)
router.post('/submit', upload.single('paymentScreenshot'), submitPayment);
router.get('/my-payments', getUserPayments);
router.get('/:paymentId', getPaymentById);

// Admin routes (require admin authentication)
router.get('/admin/pending', getPendingPayments);
router.get('/admin/all', getAllPayments);
router.get('/admin/stats', getPaymentStats);
router.put('/admin/approve/:paymentId', approvePayment);
router.put('/admin/reject/:paymentId', rejectPayment);

export default router;