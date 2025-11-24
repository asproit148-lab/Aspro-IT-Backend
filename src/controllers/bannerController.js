
import * as bannerService from "../services/bannerService.js";

export const createBanner = async (req, res) => {
  try {
    const { title, url } = req.body;
    const file = req.file || null;
    console.log("File Received:", file);

    const banner = await bannerService.addBanner(title, file, url);
    res.status(201).json({ message: "Banner added successfully", banner });
  } catch (err) {
    console.error("Create Banner Error:", err);
    res.status(500).json({ message: "Failed to create banner", error: err.message });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.status(200).json({ message: "Banners fetched successfully", banners });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners", error: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner", error: err.message });
  }
};

export const updateBannner=async(req,res)=>{
  try {
    const{updates}=req.body;

    await bannerService.updateBanner(req.params.id,updates);
    res.status(200).json({ message: "Banner update successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update banner", error: err.message });
  }
}

export const totalBanners=async(req,res)=>{
  try {
    const total=await bannerService.totalBanners();
    res.status(200).json({message:"Total Banners fetched",total});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch total banners", error: err.message });
  }
}