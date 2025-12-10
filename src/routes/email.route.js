import express from 'express';
import {EnquiryForm,ContactForm,EnrollmentForm,requestEmailOtp,verifyEmailOtp} from '../controllers/emailController.js'

const router=express.Router();

router.route('/enquiry').post(EnquiryForm);
router.route('/contact').post(ContactForm);
router.route('/enrollment').post(EnrollmentForm);
router.route('/request-email-otp').post(requestEmailOtp);
router.route('/verify-email-otp').post(verifyEmailOtp);
export default router;