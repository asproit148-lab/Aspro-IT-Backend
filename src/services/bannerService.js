import Banner from "../models/bannerModel.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";
import { indexToPinecone, deleteFromPinecone } from "../utils/indexer.js";
import { courseToText } from "../utils/courseToText.js";

const bannerToText = (banner) => {
  return `Banner Title: ${banner.title}\nURL: ${banner.url || "N/A"}`;
};



export const addBanner = async (title, fileObject, url) => { // Renamed 'image' to 'fileObject' for clarity
  let BannerImage = null;
  // Access the path property from the file object passed from the controller
  if (fileObject?.path) { 
    const uploadResult = await uploadOnCloudinary(fileObject.path);
    BannerImage = uploadResult.secure_url;
  }
  const newBanner = await Banner.create({ title, image: BannerImage, url });

    await indexToPinecone({
    id: newBanner._id,
    type: "banner",
    text: bannerToText(newBanner),
    metadata: {
      title: newBanner.title,
      url: newBanner.url
    }
  });

  return newBanner;

};

export const getAllBanners = async () => {
  return await Banner.find({ isActive: true });
};

export const deleteBanner = async (id) => {
  const deleted = await Banner.findByIdAndDelete(id);
  if (deleted) {
    await deleteFromPinecone("banner", id);
  }
  return deleted;
};

export const updateBanner = async (id, updates) => {
  return await Banner.findByIdAndUpdate(id, updates, { new: true });
};

export const totalBanners = async () => {
  return await Banner.countDocuments();
};