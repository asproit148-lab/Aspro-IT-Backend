import express from 'express';
import { addQuestion, getAllQuestions, getQuestionById, deleteQuestionById, downloadQuestion} from '../controllers/questionController.js';
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Routes
router.post('/add-question', upload.single('file'), addQuestion);
router.get('/all-questions', getAllQuestions);
router.get('/question-info/:id', getQuestionById);
router.delete('/delete-question/:id', deleteQuestionById);
router.get('/download-question/:id', downloadQuestion);
export default router;
