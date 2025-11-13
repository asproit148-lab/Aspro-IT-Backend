import express from 'express';
import {getAllCourses,enrollCourse,addCourse,getCourse,deleteCourse} from '../controllers/courseController.js'
import {authenticate} from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multerMiddleware.js";

const router=express.Router();

router.route('/add-Course').post(upload.single('imageUrl'),addCourse);
router.route('/course-info/:CourseId').get(getCourse);
router.route('/enroll-course').post(authenticate,enrollCourse);
router.route('/delete-course/:courseId').delete(deleteCourse);
router.route('/all-courses').get(getAllCourses);

export default router;