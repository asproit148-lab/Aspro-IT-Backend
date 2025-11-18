import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // detect extension
    const ext = localFilePath.split('.').pop().toLowerCase();

    // force resource_type RAW for pdf/doc/docx
    let resourceType = "auto";
    if (["pdf", "doc", "docx", "txt"].includes(ext)) {
      resourceType = "raw";
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType
    });

    console.log("Uploaded:", response.secure_url);

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    try { fs.unlinkSync(localFilePath); } catch (e) {}

    return null;
  }
};

export { uploadOnCloudinary };
