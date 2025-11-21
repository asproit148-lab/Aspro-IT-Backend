import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided");
      return null;
    }

    // Check file exists
    if (!fs.existsSync(localFilePath)) {
      console.error("❌ File does not exist:", localFilePath);
      return null;
    }

    // Check file size
    const stats = fs.statSync(localFilePath);
    if (stats.size === 0) {
      console.error("❌ File is empty!");
      return null;
    }

    console.log("⬆️ Uploading:", localFilePath);

    // Detect extension
    const ext = localFilePath.split('.').pop().toLowerCase();
    console.log("📎 File extension:", ext);

    // Decide resource type
    let resourceType = "auto";

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      resourceType = "image";
    } else if (ext === "pdf") {
      resourceType = "raw";  // IMPORTANT
    }

    console.log("🔧 Final resource type:", resourceType);

    // Upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: "resources",
      type: "upload",
      access_mode: "public",
      ...(ext === "pdf" && { format: "pdf" })  // ensures correct metadata for PDFs
    });

    console.log("✅ Upload successful!");
    console.log("🔗 URL:", response.secure_url);
    console.log("🆔 Public ID:", response.public_id);

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);
    console.log("🗑️ Local file deleted");

    return response;

  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);

    // Clean file on error
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ cleaned up local file after error");
      }
    } catch (e) {
      console.error("Failed to delete local file:", e);
    }

    return null;
  }
};

export { uploadOnCloudinary };
