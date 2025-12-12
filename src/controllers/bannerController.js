
import * as bannerService from "../services/bannerService.js";

export const createBanner = async (req, res) => {
  try {
    // Extract title and url from req.body
    const { title, url } = req.body;
    // req.file holds the uploaded file object (because of upload.single('image'))
    const file = req.file || null; 
    
    // Check if essential fields are present
    if (!title || !url || !file) {
        return res.status(400).json({ message: "Missing required fields: title, url, or image." });
    }

    console.log("Incoming file for banner:", file);
    
    // Pass arguments in the correct order: title, file (image), url
    const banner = await bannerService.addBanner(title, file, url); 
    
    return res.status(201).json({ message: "Banner added successfully", banner });

  } catch (error) {
     console.error("Error creating banner:", error);
     return res.status(500).json({ message: "Failed to add banner", error: error.message });
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