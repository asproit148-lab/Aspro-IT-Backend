import express from 'express';
import {addBlog,updateBlog,deleteBlog,getBlog,getBlogs} from '../controllers/blogController.js';

const router=express.Router();
router.route('/add-blog').post(addBlog);
router.route('/update-blog/:blogId').patch(updateBlog);
router.route('/delete/:blogId').delete(deleteBlog);
router.route('/get-blog/:blogId').get(getBlog);
router.route('/get-all-blogs').get(getBlogs);


export default router;