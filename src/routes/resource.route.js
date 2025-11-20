import express from 'express';
import { downloadResource,addResource, getAllResources, getResourceById, deleteResourceById } from '../controllers/resourceController.js';
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Routes
router.post('/add-resource', upload.single('filePath'), addResource);
router.get('/all-resources', getAllResources);
router.get('/resource-info/:id', getResourceById);
router.delete('/delete-resource/:id', deleteResourceById);
router.get('/download-resource/:id', downloadResource);

export default router;
