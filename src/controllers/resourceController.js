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

// FIXED DOWNLOAD - Multiple methods
const downloadResource = async (req, res) => {
  try {
    // Get resource from database
    const resource = await resourceService.getResourceById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (!resource.url) {
      return res.status(404).json({ message: "Resource URL not found" });
    }

    console.log("Downloading resource:", resource.title);
    console.log("URL:", resource.url);

    // Fetch file from Cloudinary as buffer (more reliable than stream)
    const response = await axios.get(resource.url, {
      responseType: 'arraybuffer',
      timeout: 60000, // 60 seconds
      maxContentLength: 100 * 1024 * 1024, // 100MB max
      headers: {
        'Accept': 'application/pdf,application/octet-stream'
      }
    });

    // Determine file extension
    const urlParts = resource.url.split('.');
    const ext = urlParts[urlParts.length - 1].split('?')[0] || 'pdf';
    const filename = resource.title.includes('.') ? resource.title : `${resource.title}.${ext}`;

    // Set response headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'no-cache');

    // Send file
    res.send(Buffer.from(response.data));
    
    console.log("Download successful:", filename);

  } catch (err) {
    console.error("Error downloading resource:", err.message);
    
    // Log more details
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }

    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Failed to download resource",
        error: err.message 
      });
    }
  }
};

// ALTERNATIVE: Simple redirect method (most reliable)
const downloadResourceRedirect = async (req, res) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);

    if (!resource || !resource.url) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Add fl_attachment flag to force download
    const downloadUrl = resource.url.replace('/upload/', '/upload/fl_attachment/');
    
    console.log("Redirecting to:", downloadUrl);
    
    // Redirect to Cloudinary
    return res.redirect(downloadUrl);

  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ message: "Failed to download resource" });
  }
};

export { 
  addResource, 
  getAllResources, 
  getResourceById, 
  deleteResourceById, 
  downloadResource,
  downloadResourceRedirect 
};