import Question from '../models/questionModel.js';
import { uploadOnCloudinary } from '../utils/uploadImage.js';

// Add a question
const addQuestion = async (title, filePath, description, category) => {
  let uploadedUrl = filePath;
  let publicId = null;

  if (filePath) {
    const uploadResult = await uploadOnCloudinary(filePath);
    if (!uploadResult) {
      throw new Error('Failed to upload file to Cloudinary');
    }
    uploadedUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;
  }

  console.log("Uploaded URL:", uploadedUrl);
  
  const question = await Question.create({
    title,
    url: uploadedUrl,
    public_id: publicId,
    description,
    category
  });

  return question;
};

// Get all questions
const getAllQuestions = async () => {
  const questions = await Question.find().sort({ createdAt: -1 });
  return questions;
};

// Get questions by category/courseId
const getQuestionsByCategory = async (category) => {
  const questions = await Question.find({ category: category }).sort({ createdAt: -1 });
  return questions;
};

// Get single question by ID
const getQuestionById = async (id) => {
  const question = await Question.findById(id);
  if (!question) throw new Error('Question not found');
  return question;
};

// Delete question by ID
const deleteQuestionById = async (id) => {
  const deleted = await Question.findByIdAndDelete(id);
  if (!deleted) throw new Error('Question not found');
  return deleted;
};

export { 
  addQuestion, 
  getAllQuestions, 
  getQuestionById, 
  deleteQuestionById, 
  getQuestionsByCategory
};
