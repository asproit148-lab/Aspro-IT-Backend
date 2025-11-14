import Banner from "../models/bannerModel.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";

export const addBanner = async (title, description, image) => {
  
  let BannerImage = null;
  if(image){
    const uploadResult = await uploadOnCloudinary(image.path);
    BannerImage= uploadResult.secure_url;
  }
  return await Banner.create({ title, description, image: BannerImage });
};

export const getAllBanners = async () => {
  return await Banner.find({ isActive: true });
};

export const deleteBanner = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

export const updateBanner = async (id, updates) => {
  return await Banner.findByIdAndUpdate(id, updates, { new: true });
};
