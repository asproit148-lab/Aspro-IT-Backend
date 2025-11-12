import express from 'express';
import {addBlog,updateBlog,deleteBlog,getBlog,getBlogs} from '../controllers/blogController.js';
import {upload} from "../middlewares/multerMiddleware.js";

const router=express.Router();
router.route('/add-blog').post(upload.single('BlogImage'),addBlog);
router.route('/update-blog/:blogId').patch(upload.single("BlogImage"),updateBlog);
router.route('/delete/:blogId').delete(deleteBlog);
router.route('/get-blog/:blogId').get(getBlog);
router.route('/get-all-blogs').get(getBlogs);


export default router;