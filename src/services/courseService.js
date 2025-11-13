import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";

const addCourse = async (
  Course_title,
  Course_category,
  Course_description,
  imageUrl,
  Course_type,
  Modules,
  Course_cost,
  Discount,
  FAQs
) => {
   if (typeof Modules === "string") {
      Modules = JSON.parse(Modules);
    }
    if (typeof FAQs === "string") {
      FAQs = JSON.parse(FAQs);
    }

    let CourseImage;
    if(imageUrl){
     const uploadResult = await uploadOnCloudinary(imageUrl);
    CourseImage= uploadResult.secure_url;
    }


  const newCourse = new Course({
    Course_title,
    Course_category,
    Course_description,
    imageUrl:CourseImage,
    Course_type,
    Modules,
    Course_cost,
    Discount,
    FAQs
  });

  await newCourse.save();

  return newCourse;
};

const getCourseInfo = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    return null;
  }

  return course;
}

const updateCourse = async (data, courseId) => {
  const course = await Course.findById(courseId);
  
  if (!course) {
    throw new Error("Course not found");
  }

  course.set(data);
  const updatedCourse = await course.save();

  return updatedCourse;
}

const enrollCourse = async (userId, courseId) => {
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) {
    throw new Error("User or course not found");
  }

  if (user.coursesEnrolled.includes(courseId)) {
    throw new Error("User already enrolled in this course");
  }

  user.coursesEnrolled.push(courseId);
  await user.save();
  
  return user;
}

const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
}

const getCourses = async () => {
  const courses = await Course.find();

  return courses;
}


const getTotalEnrollments = async () => {
  const result = await User.aggregate([
    {
      $project: {
        enrollmentCount: { $size: "$coursesEnrolled" }
      }
    },
    {
      $group: {
        _id: null,
        totalEnrollments: { $sum: "$enrollmentCount" }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalEnrollments : 0;
};

// Get enrollment count for a specific course
const getCourseEnrollmentCount = async (courseId) => {
  const count = await User.countDocuments({
    coursesEnrolled: courseId
  });

  return count;
};

// Get enrollments per course (detailed breakdown)
const getEnrollmentsPerCourse = async () => {
  const result = await User.aggregate([
    {
      $unwind: "$coursesEnrolled"
    },
    {
      $group: {
        _id: "$coursesEnrolled",
        enrollmentCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "courseInfo"
      }
    },
    {
      $unwind: "$courseInfo"
    },
    {
      $project: {
        courseId: "$_id",
        courseName: "$courseInfo.Course_title",
        enrollmentCount: 1
      }
    },
    {
      $sort: { enrollmentCount: -1 }
    }
  ]);

  return result;
};

// Get users with most enrollments
const getUsersWithMostEnrollments = async (limit = 10) => {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,
        email: 1,
        enrollmentCount: { $size: "$coursesEnrolled" }
      }
    },
    {
      $sort: { enrollmentCount: -1 }
    },
    {
      $limit: limit
    }
  ]);

  return result;
};

// Get enrollment statistics summary
const getEnrollmentStats = async () => {
  const [totalEnrollments, totalUsers, usersWithEnrollments] = await Promise.all([
    getTotalEnrollments(),
    User.countDocuments(),
    User.countDocuments({ coursesEnrolled: { $ne: [] } })
  ]);

  const averageEnrollmentsPerUser = totalUsers > 0 
    ? (totalEnrollments / totalUsers).toFixed(2) 
    : 0;

  return {
    totalEnrollments,
    totalUsers,
    usersWithEnrollments,
    usersWithoutEnrollments: totalUsers - usersWithEnrollments,
    averageEnrollmentsPerUser
  };
};


export default { 
  addCourse, 
  getCourseInfo, 
  updateCourse, 
  enrollCourse, 
  deleteCourse, 
  getCourses 
};