import Coupon from "../models/couponModel.js";
import { indexToPinecone, deleteFromPinecone } from "../utils/indexer.js";

const couponToText = (coupon) => {
  return `Coupon Code: ${coupon.Code}\nDiscount: ${coupon.Discount}%\nExpiry Date: ${coupon.Expiry_date}`;
};


const addCoupon = async (Code, Discount, Expiry_date) => {

  const existingCoupon = await Coupon.findOne({ Code });
  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  const newCoupon = new Coupon({
    Code,
    Discount,
    Expiry_date
  });

  await newCoupon.save();
    await indexToPinecone({
    id: newCoupon._id,
    type: "coupon",
    text: couponToText(newCoupon),
    metadata: { code: newCoupon.Code, discount: newCoupon.Discount }
  });

  return newCoupon;
};

const updateCoupon = async (data, couponId) => {
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  // If updating code, check it doesn't already exist
  if (data.Code) {
    const existingCoupon = await Coupon.findOne({ 
      Code: data.Code, 
      _id: { $ne: couponId } 
    });
    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }
  }

  coupon.set(data);
  const updatedCoupon = await coupon.save();

    await indexToPinecone({
    id: updatedCoupon._id,
    type: "coupon",
    text: couponToText(updatedCoupon),
    metadata: { code: updatedCoupon.Code, discount: updatedCoupon.Discount }
  });


  return updatedCoupon;
};

const deleteCoupon = async (couponId) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

    await deleteFromPinecone("coupon", couponId);


  return coupon;
};

const applyCoupon = async (Code, amount) => {
  const coupon = await Coupon.findOne({ Code });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  // Check if coupon is expired
  const currentDate = new Date();
  if (coupon.Expiry_date < currentDate) {
    throw new Error("Coupon has expired");
  }

  // Calculate discount
  const discountAmount = (amount * coupon.Discount) / 100;
  const finalAmount = amount - discountAmount;

  return {
    originalAmount: amount,
    discountPercent: coupon.Discount,
    discountAmount: discountAmount,
    finalAmount: finalAmount,
    couponCode: Code
  };
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find().sort({ Expiry_date: -1 });
  return coupons;
};

const getCouponById = async (couponId) => {
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return coupon;
};

const getCouponByCode = async (Code) => {
  const coupon = await Coupon.findOne({ Code });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return coupon;
};

const getTotalCoupons=async()=>{
  const coupons=await Coupon.countDocuments();
  return coupons;
}
export default {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  getTotalCoupons
};