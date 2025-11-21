import Resource from '../models/resourceModel.js';
import { uploadOnCloudinary } from '../utils/uploadImage.js';

// Add a resource
const addResource = async (title, filePath, description) => {
  let uploadedUrl = filePath;
  if (filePath) {
    const uploadResult = await uploadOnCloudinary(filePath, 'resources');
    uploadedUrl = uploadResult.secure_url;
  }
  console.log("Uploaded URL:", uploadedUrl);
  const resource = await Resource.create({
    title,
    url: uploadedUrl,
    description,
  });
  return resource;
};

// Get all resources
const getAllResources = async () => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  return resources;
};

// Get single resource by ID
const getResourceById = async (id) => {
  const resource = await Resource.findById(id);
  if (!resource) throw new Error('Resource not found');
  return resource;
};

// Delete resource by ID
const deleteResourceById = async (id) => {
  const deleted = await Resource.findByIdAndDelete(id);
  if (!deleted) throw new Error('Resource not found');
  return deleted;
};

export { addResource, getAllResources, getResourceById, deleteResourceById };
