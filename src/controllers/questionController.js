import * as questionService from '../services/questionService.js';
import axios from 'axios';

// Add a question
const addQuestion = async (req, res) => {
  try {
    const { title, description, category } = req.body; 
    const filePath = req.file ? req.file.path : null;

    if (!title || !description || !category || !filePath) { 
      return res.status(400).json({ error: "Please provide all fields, including category" });
    }

    const question = await questionService.addQuestion(title, filePath, description, category);
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

// Get questions by course ID
const getQuestionsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const questions = await questionService.getQuestionsByCategory(courseId); 

    return res.status(200).json({ 
      message: `Questions for course ${courseId} fetched successfully`,
      questions 
    });
  } catch (err) {
    console.error("Error fetching questions by course ID:", err);
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

// FIXED: Direct download (no redirect)
const downloadQuestion = async (req, res) => {
  try {
    // Get question from database
    const question = await questionService.getQuestionById(req.params.id);

    if (!question || !question.url) {
      return res.status(404).json({ message: "Question not found" });
    }

    console.log("📥 Downloading question:", question.title);
    console.log("🔗 URL:", question.url);

    // Fetch file from Cloudinary as arraybuffer
    const response = await axios.get(question.url, {
      responseType: 'arraybuffer',
      timeout: 90000, // 90 seconds for large files
      maxContentLength: 100 * 1024 * 1024, // 100MB
      maxBodyLength: 100 * 1024 * 1024,
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // Extract file extension from URL
    const urlParts = question.url.split('/');
    const cloudinaryFileName = urlParts[urlParts.length - 1].split('?')[0];
    const extension = cloudinaryFileName.split('.').pop() || 'pdf';
    
    // Create download filename
    let downloadFileName;
    if (question.title.includes('.')) {
      downloadFileName = question.title;
    } else {
      downloadFileName = `${question.title}.${extension}`;
    }

    // Get content type from response or default to PDF
    const contentType = response.headers['content-type'] || 'application/pdf';

    console.log("📄 Filename:", downloadFileName);
    console.log("📦 Size:", response.data.byteLength, "bytes");
    console.log("🗂️ Type:", contentType);

    // Set response headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFileName}"`);
    res.setHeader('Content-Length', response.data.byteLength);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send file buffer
    res.send(Buffer.from(response.data));

    console.log("✅ Download completed successfully");

  } catch (err) {
    console.error("❌ Error downloading question:", err.message);
    
    // Log additional error details
    if (err.response) {
      console.error("📍 Response status:", err.response.status);
      console.error("📍 Response headers:", err.response.headers);
    }
    
    if (err.code === 'ECONNABORTED') {
      console.error("⏱️ Request timeout");
    }

    if (err.code === 'ERR_BAD_REQUEST') {
      console.error("🚫 Bad request to Cloudinary");
    }

    // Send error response if headers not sent
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Failed to download question",
        error: err.message 
      });
    }
  }
};

export { 
  addQuestion, 
  getAllQuestions, 
  getQuestionById, 
  deleteQuestionById, 
  downloadQuestion, 
  getQuestionsByCourseId
};