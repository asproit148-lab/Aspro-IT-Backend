import express from 'express';
import { 
  addCoupon, 
  editCoupon, 
  deleteCoupon, 
  applyCoupon, 
  getAllCoupons, 
  getCoupon 
} from '../controllers/couponController.js';

const router = express.Router();

// Admin routes - add your auth middleware here if needed
router.post('/add', addCoupon);                    // Add new coupon
router.put('/edit/:couponId', editCoupon);         // Edit coupon by ID
router.delete('/delete/:couponId', deleteCoupon);  // Delete coupon by ID
router.get('/all', getAllCoupons);                 // Get all coupons
router.get('/:couponId', getCoupon);               // Get single coupon by ID

// User routes
router.post('/apply', applyCoupon);                // Apply coupon to calculate discount

export default router;