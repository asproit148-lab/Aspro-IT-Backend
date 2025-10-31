// services/bannerService.js
import Banner from "../models/bannerModel.js";

export const addBanner = async (data) => {
  return await Banner.create(data);
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
