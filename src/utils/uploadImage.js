import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided");
      return null;
    }

    if (!fs.existsSync(localFilePath)) {
      console.error("❌ File does not exist:", localFilePath);
      return null;
    }

    const stats = fs.statSync(localFilePath);
    console.log("📄 File size:", stats.size, "bytes");
    
    if (stats.size === 0) {
      console.error("❌ File is empty!");
      return null;
    }

    console.log("⬆️  Uploading to Cloudinary:", localFilePath);

    const ext = localFilePath.split('.').pop().toLowerCase();
    console.log("📎 File extension:", ext);

    let resourceType = "raw";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      resourceType = "image";
    }

    console.log("🔧 Resource type:", resourceType);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: "resources",
      type: "upload", // This ensures it's publicly accessible
      access_mode: "public", // THIS IS THE KEY - makes files public
    });

    console.log("✅ Upload successful!");
    console.log("🔗 URL:", response.secure_url);
    console.log("🆔 Public ID:", response.public_id);

    fs.unlinkSync(localFilePath);
    console.log("🗑️  Local file deleted");

    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:");
    console.error("Message:", error.message);
    console.error("Error:", error);

    try { 
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath); 
        console.log("🗑️  Cleaned up local file after error");
      }
    } catch (e) {
      console.error("Failed to delete local file:", e);
    }

    return null;
  }
};

export { uploadOnCloudinary };