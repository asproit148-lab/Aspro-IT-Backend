import express from 'express';
import {
  downloadCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getAllCertificates
} from '../controllers/certificateController.js';
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get('/my-certificates', getUserCertificates);
router.get('/download/:courseId',authenticate,downloadCertificate);
router.get('/:certificateId', getCertificateById);

// Public route for certificate verification
router.get('/verify/:certificateNumber', verifyCertificate);

// Admin routes (require admin authentication)
router.get('/admin/all', getAllCertificates);

export default router;