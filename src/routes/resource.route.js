import express from 'express';
import {addResource} from '../controllers/resourceController.js';
const router=express.Router();
import {upload} from "../middlewares/multerMiddleware.js";

router.route('/add-resource').post(upload.single('filePath'), addResource);
export default router;