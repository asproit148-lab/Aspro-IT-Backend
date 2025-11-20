import * as resourceService from '../services/resourceService.js';
import axios from 'axios';
// Add a resource
const addResource = async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!title || !description || !filePath) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const resource = await resourceService.addResource(title, filePath, description);
    return res.status(200).json({ message: "Resource added successfully", resource });
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await resourceService.getAllResources();
    return res.status(200).json({ resources });
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single resource by ID
const getResourceById = async (req, res) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    return res.status(200).json({ resource });
  } catch (err) {
    console.error("Error fetching resource:", err);
    res.status(404).json({ message: err.message });
  }
};

// Delete resource by ID
const deleteResourceById = async (req, res) => {
  try {
    const deleted = await resourceService.deleteResourceById(req.params.id);
    return res.status(200).json({ message: "Resource deleted successfully", deleted });
  } catch (err) {
    console.error("Error deleting resource:", err);
    res.status(404).json({ message: err.message });
  }
};


const downloadResource = async (req, res) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    
    // Fetch the file from Cloudinary
    const response = await axios({
      url: resource.url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000 // 30 second timeout
    });

    // Set headers for download
    const filename = `${resource.title}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', response.headers['content-length']);

    // Pipe the stream to response
    response.data.pipe(res);
    
  } catch (err) {
    console.error("Error downloading resource:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to download resource" });
    }
  }
};

export { addResource, getAllResources, getResourceById, deleteResourceById,downloadResource};
