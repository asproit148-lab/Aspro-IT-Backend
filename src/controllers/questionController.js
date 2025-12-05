import * as questionService from '../services/questionService.js';
import axios from 'axios';
// Add a question
const addQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!title || !description || !filePath) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const question = await questionService.addQuestion(title, filePath, description);
    return res.status(200).json({ message: "Question added successfully", question });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions();
    return res.status(200).json({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    return res.status(200).json({ question });
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(404).json({ message: err.message });
  }
};

// Delete question by ID
const deleteQuestionById = async (req, res) => {
  try {
    const deleted = await questionService.deleteQuestionById(req.params.id);
    return res.status(200).json({ message: "Question deleted successfully", deleted });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(404).json({ message: err.message });
  }
};


const downloadQuestion = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    
    // Fetch the file from Cloudinary
    const response = await axios({
      url: question.url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000 // 30 second timeout
    });

    // Set headers for download
    const filename = `${question.title}.pdf`;
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

export { addQuestion, getAllQuestions, getQuestionById, deleteQuestionById, downloadQuestion};