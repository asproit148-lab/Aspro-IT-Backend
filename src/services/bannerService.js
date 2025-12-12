import Banner from "../models/bannerModel.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";

export const addBanner = async (title, fileObject, url) => { // Renamed 'image' to 'fileObject' for clarity
  let BannerImage = null;
  // Access the path property from the file object passed from the controller
  if (fileObject?.path) { 
    const uploadResult = await uploadOnCloudinary(fileObject.path);
    BannerImage = uploadResult.secure_url;
  }
  return await Banner.create({ title, image: BannerImage, url });
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

export const totalBanners = async () => {
  return await Banner.countDocuments();
};