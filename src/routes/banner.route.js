import express from "express";
import { createBanner, getBanners, deleteBanner } from "../controllers/bannerController.js";
import{ upload } from "../middlewares/multerMiddleware.js";
const router = express.Router();

// Admin routes
router.post("/add", upload.single('image'), createBanner);
router.delete("/:id", deleteBanner);

// Public route for homepage
router.get("/", getBanners);

export default router;
