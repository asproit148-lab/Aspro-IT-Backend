import express from 'express';
import {EnquiryForm,ContactForm,EnrollmentForm} from '../controllers/emailController.js'

const router=express.Router();

router.route('/enquiry').post(EnquiryForm);
router.route('/contact').post(ContactForm);
router.route('/enrollment').post(EnrollmentForm);
export default router;