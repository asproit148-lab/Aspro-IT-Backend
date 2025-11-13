import express from 'express';
import {
  generateCertificate,
  downloadCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getAllCertificates
} from '../controllers/certificateController.js';

const router = express.Router();

// User routes (require user authentication)
router.post('/generate', generateCertificate);
router.get('/my-certificates', getUserCertificates);
router.get('/download/:certificateId', downloadCertificate);
router.get('/:certificateId', getCertificateById);

// Public route for certificate verification
router.get('/verify/:certificateNumber', verifyCertificate);

// Admin routes (require admin authentication)
router.get('/admin/all', getAllCertificates);

export default router;