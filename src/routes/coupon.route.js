import express from 'express';
import { 
  addCoupon, 
  editCoupon, 
  deleteCoupon, 
  applyCoupon, 
  getAllCoupons, 
  getCoupon,
  totalCoupons
} from '../controllers/couponController.js';

const router = express.Router();


router.post('/add', addCoupon);                    
router.put('/edit/:couponId', editCoupon);         
router.delete('/delete/:couponId', deleteCoupon);  
router.get('/all', getAllCoupons);    
router.get('/total', totalCoupons);                
router.get('/:couponId', getCoupon);              
router.post('/apply', applyCoupon);               

export default router;