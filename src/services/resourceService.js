import Resource from '../models/resourceModel.js';
import {uploadOnCloudinary} from '../utils/uploadImage.js';

const addResource = async (title, filePath, description) => {
  
  let uploadedUrl = filePath;
  if (filePath) {
    const uploadResult = await uploadOnCloudinary(filePath, 'resources');
    uploadedUrl = uploadResult.secure_url;
  }
  const resource = await Resource.create({
    title,
    url: uploadedUrl,
    description
  });
  return resource;
};
export { addResource };