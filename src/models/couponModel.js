import mongoose from 'mongoose';

const couponSchema=new mongoose.Schema({
  Code:{
    type:String,
    required:true,
  },
  Discount:{
    type:Number,
    required:true,

  },
  Expiry_date:{
    type:Date,
    required:true,
  },
});

const Coupon=mongoose.model("Coupon",couponSchema);
export default Coupon;