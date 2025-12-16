import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import { indexToPinecone, deleteFromPinecone } from "../utils/indexer.js";
import { uploadOnCloudinary } from "../utils/uploadImage.js";
import { courseToText } from "../utils/courseToText.js";


const addCourse = async ({
  Course_title,
  Course_description,
  Course_type,
  Skills,
  Modules,
  What_you_will_learn,
  Course_cost,
  
  Discount,
  FAQs,
  imageUrl,
}) => {
  // Make mutable copies
  let parsedSkills = Skills;
  let parsedModules = Modules;
  let parsedFAQs = FAQs;
  let parsedLearnings = What_you_will_learn;

  if (typeof parsedSkills === "string") {
    try { parsedSkills = JSON.parse(parsedSkills); } catch {}
  }

  if (typeof parsedModules === "string") {
    try { parsedModules = JSON.parse(parsedModules); } catch {}
  }

  if (typeof parsedFAQs === "string") {
    try { parsedFAQs = JSON.parse(parsedFAQs); } catch {}
  }

  if (typeof parsedLearnings === "string") {
    try { parsedLearnings = JSON.parse(parsedLearnings); } catch {}
  }

  let uploadedImage = null;
console.log("Image File Received:", imageUrl);
  if (imageUrl) {
    const uploadResult = await uploadOnCloudinary(imageUrl);
    uploadedImage = uploadResult.secure_url;
  }
  console.log("Uploaded Image URL:", uploadedImage);

  const newCourse = new Course({
    Course_title,
    Course_description,
    Course_type,
    Skills: parsedSkills,
    Modules: parsedModules,
    What_you_will_learn: parsedLearnings,
    Course_cost,
    Discount,
    FAQs: parsedFAQs,
    imageUrl: uploadedImage,
  });

  await newCourse.save();

  await indexToPinecone({
  id: newCourse._id,
  type: "course",
  text: courseToText(newCourse),
  metadata: {
    title: newCourse.Course_title,
    courseType: newCourse.Course_type,
    cost: newCourse.Course_cost
  }
});


  return newCourse;
};


const getCourseInfo = async (id) => {
  return await Course.findById(id);
};

const editCourse = async (id, data, imageFile) => {
  if (typeof data.Skills === "string") data.Skills = JSON.parse(data.Skills);
  if (typeof data.Modules === "string") data.Modules = JSON.parse(data.Modules);
  if (typeof data.FAQs === "string") data.FAQs = JSON.parse(data.FAQs);
  if (typeof data.What_you_will_learn === "string") data.What_you_will_learn = JSON.parse(data.What_you_will_learn);

  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found");

  if (imageFile) {
    const uploaded = await uploadOnCloudinary(imageFile);
    course.imageUrl = uploaded.secure_url;
  }

  course.Course_title = data.Course_title || course.Course_title;
  course.Course_description = data.Course_description || course.Course_description;
  course.Course_type = data.Course_type || course.Course_type;
  course.Skills = data.Skills || course.Skills;
  course.Modules = data.Modules || course.Modules;
  course.Course_cost = data.Course_cost || course.Course_cost;
  course.Discount = data.Discount ?? course.Discount;
  course.FAQs = data.FAQs || course.FAQs;
  course.What_you_will_learn = data.What_you_will_learn || course.What_you_will_learn;

const updatedCourse = await course.save();

// 🔥 RE-INDEX UPDATED COURSE
await indexToPinecone({
  id: updatedCourse._id,
  type: "course",
  text: courseToText(updatedCourse),
  metadata: {
    title: updatedCourse.Course_title,
    courseType: updatedCourse.Course_type,
    cost: updatedCourse.Course_cost
  }
});

return updatedCourse;
};

const deleteCourse = async (courseId) => {
  const deleted = await Course.findByIdAndDelete(courseId);

  if (deleted) {
    // 🔥 REMOVE FROM PINECONE
    await deleteFromPinecone("course", courseId);
  }

  return deleted;
};


const getCourses = async () => {
  return await Course.find();
};

const enrollCourse = async (userId, courseId) => {
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) throw new Error("User or course not found");
  if (user.coursesEnrolled.includes(courseId))
    throw new Error("User already enrolled");

  user.coursesEnrolled.push(courseId);
  await user.save();

  return user;
};

const getTotalEnrollments = async () => {
  const users = await User.find();
  return users.reduce((acc, u) => acc + u.coursesEnrolled.length, 0);
};

const getCourseEnrollmentCount = async (courseId) => {
  return await User.countDocuments({ coursesEnrolled: courseId });
};
const getTotalCourses=async()=>{
  return await Course.countDocuments();
}

export default {
  addCourse,
  getCourseInfo,
  editCourse,
  deleteCourse,
  getCourses,
  enrollCourse,
  getTotalEnrollments,
  getCourseEnrollmentCount,
  getTotalCourses
};
