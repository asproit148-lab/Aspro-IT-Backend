import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // image URL
    required: true
  },
  isActive: {
    type: Boolean,
    default: true // only active banners are shown on homepage
  },
  url:{
    type: String,
    required:true
  }
}, { timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
