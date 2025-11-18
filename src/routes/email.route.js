import express from 'express';
import {EnquiryForm,ContactForm} from '../controllers/emailController.js'

const router=express.Router();

router.route('/enquiry').post(EnquiryForm);
router.route('/contact').post(ContactForm);

export default router;