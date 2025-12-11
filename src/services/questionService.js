import Question from '../models/questionModel.js';
import { uploadOnCloudinary } from '../utils/uploadImage.js';

// Add a question
const addQuestion = async (title, filePath, description, category) => {
  let uploadedUrl = filePath;
  if (filePath) {
    const uploadResult = await uploadOnCloudinary(filePath);
    uploadedUrl = uploadResult.secure_url;
  }
  console.log("Uploaded URL:", uploadedUrl);
  const question = await Question.create({
    title,
    url: uploadedUrl,
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
    // MongoDB query to find all questions where the category matches the provided ID
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

export { addQuestion, getAllQuestions, getQuestionById, deleteQuestionById, getQuestionsByCategory};
