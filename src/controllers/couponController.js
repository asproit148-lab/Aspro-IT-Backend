import couponService from '../services/couponService.js';

const addCoupon = async (req, res) => {
  try {
    const { Code, Discount, Expiry_date } = req.body;

    if (!Code || !Discount || !Expiry_date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: Code, Discount, and Expiry_date"
      });
    }

    const coupon = await couponService.addCoupon(Code, Discount, Expiry_date);

    return res.status(201).json({ 
      success: true,
      message: "Coupon added successfully", 
      coupon 
    });
  } catch (err) {
    console.error("Error adding coupon:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

const editCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const { Code, Discount, Expiry_date } = req.body;

    if (!couponId) {
      return res.status(400).json({ message: "Please provide a couponId" });
    }

    let data = {};
    if (Code) data.Code = Code;
    if (Discount !== undefined) data.Discount = Discount;
    if (Expiry_date) data.Expiry_date = Expiry_date;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Please provide some fields to update" });
    }

    const updatedCoupon = await couponService.updateCoupon(data, couponId);

    return res.status(200).json({ 
      success: true,
      message: "Coupon updated successfully", 
      coupon: updatedCoupon 
    });
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!couponId) {
      return res.status(400).json({ message: "Please provide a couponId" });
    }

    await couponService.deleteCoupon(couponId);

    return res.status(200).json({ 
      success: true,
      message: "Coupon deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { Code, amount } = req.body;

    if (!Code || !amount) {
      return res.status(400).json({ 
        message: "Please provide coupon Code and amount" 
      });
    }

    const result = await couponService.applyCoupon(Code, amount);

    return res.status(200).json({ 
      success: true,
      message: "Coupon applied successfully",
      ...result
    });
  } catch (err) {
    console.error("Error applying coupon:", err);
    res.status(400).json({ message: err.message || "Invalid or expired coupon" });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();

    return res.status(200).json({ 
      success: true,
      message: "Coupons fetched successfully", 
      coupons 
    });
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!couponId) {
      return res.status(400).json({ message: "Please provide a couponId" });
    }

    const coupon = await couponService.getCouponById(couponId);

    return res.status(200).json({ 
      success: true,
      message: "Coupon fetched successfully", 
      coupon 
    });
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(404).json({ message: err.message || "Coupon not found" });
  }
};
const totalCoupons=async(req,res)=>{
  const coupons=await couponService.getTotalCoupons();
  return res.status(200).json({message:"total coupons fetched successfully",coupons});
}

export { 
  addCoupon, 
  editCoupon, 
  deleteCoupon, 
  applyCoupon, 
  getAllCoupons, 
  getCoupon,
  totalCoupons
};