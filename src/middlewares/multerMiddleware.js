import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "/tmp/uploads"; // <-- Vercel writable directory

// Create /tmp/uploads if it doesn’t exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadDir);
}

console.log("📁 Upload directory:", uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
