import Resource from '../models/resourceModel.js';
import { uploadOnCloudinary } from '../utils/uploadImage.js';
import { indexToPinecone, deleteFromPinecone } from '../utils/indexer.js';



const resourceToText = (resource) => {
  return `Title: ${resource.title}\nDescription: ${resource.description}`;
};

// Add a resource
const addResource = async (title, filePath, description) => {
  let uploadedUrl = filePath;
  let publicId=null;
  if (filePath) {
    const uploadResult = await uploadOnCloudinary(filePath, 'resources');
    uploadedUrl = uploadResult.secure_url;
    publicId=uploadResult.public_id;
  }

  console.log("Uploaded URL:", uploadedUrl);
  const resource = await Resource.create({
    title,
    url: uploadedUrl,
    public_id:publicId,  
    description,
  });

    await indexToPinecone({
    id: resource._id,
    type: "resource",
    text: resourceToText(resource),
    metadata: {
      title: resource.title,
    },
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

    await deleteFromPinecone("resource", id);

  return deleted;
};

export { addResource, getAllResources, getResourceById, deleteResourceById };
