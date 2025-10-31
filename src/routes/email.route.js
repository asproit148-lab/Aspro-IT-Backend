import express from 'express';
import EnquiryForm from '../controllers/emailController.js'

const router=express.Router();

router.route('/enquiry').post(EnquiryForm);

export default router;