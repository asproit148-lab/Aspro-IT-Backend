import express from 'express';
import {getAllCourses,editCourse,enrollCourse,addCourse,getCourse,deleteCourse,getTotalEnrollments, getCourseEnrollments} from '../controllers/courseController.js'
import {authenticate} from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multerMiddleware.js";

const router=express.Router();

router.route('/add-Course').post(upload.single('imageUrl'),addCourse);
router.route('/course-info/:CourseId').get(getCourse);
router.route('/:courseId/edit-course').put(upload.single('imageUrl'),editCourse);
router.route('/enroll-course').post(authenticate,enrollCourse);
router.route('/delete-course/:courseId').delete(deleteCourse);
router.route('/all-courses').get(getAllCourses);
router.route('/total-enrollment').get(getTotalEnrollments);
router.route('/course-enrollment/:courseId').get(getCourseEnrollments);

export default router;