import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

const addCourse = async(
  name,
  category,
  price,
  discountedPrice,
  discount,
  learnings,
  skills,
  courseDescription,
  courseFeedback,
  courseFaq
) => {

const newCourse= new Course({name,
      category,
      price,
      discountedPrice,
      discount,
      learnings,
      skills,
      courseDescription,
      courseFeedback,
      courseFaq})

      await newCourse.save();
      
      return newCourse;
};

const getCourseInfo=async(courseId)=>{

  const course=await Course.findById(courseId);

  if(!course){
    return null;
  }

  return course;
}

const updateCourse=async(data,courseId)=>{
  const course=await Course.findById(courseId);
  if(!course){
    throw new Error("course not found");
  }
  course.set(data);
  const updatedCourse=await course.save();

  return updatedCourse;
}

const enrollCourse=async(userId,courseId)=>{

  console.log(userId,courseId);
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);


        if (!user || !course) {
          throw new Error("user or course not found")
        }
    
        
        if (user.coursesEnrolled.includes(courseId)) {
          throw new Error("user already enrolled in these course");
        }

        user.coursesEnrolled.push(courseId);
    await user.save();
return user;
}

const deleteCourse=async(courseId)=>{
  const course=await Course.findByIdAndDelete(courseId);

  if(!course){
    throw new Error("course not found");
  }

  return course
}

const getCourses=async()=>{
  const courses=await Course.find();

  return courses;
}

export default {addCourse,getCourseInfo,updateCourse,enrollCourse,deleteCourse,getCourses};