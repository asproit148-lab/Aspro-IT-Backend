import courseService from '../services/courseService.js'

const addCourse = async (req, res) => {
  const {
    Course_title,
    Course_category,
    Course_description,
    Course_type,
    Modules,
    Course_cost,
    Discount,
    FAQs
  } = req.body;

  if (
    !Course_title ||
    !Course_category ||
    !Course_description ||
    !Course_type ||
    !Course_cost ||
    !Discount
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: Course_title, Course_category, Course_description, Course_type, and Course_cost"
    });
  }

  try {
        const imageUrl = req.file ? req.file.path : null;
      console.log(imageUrl);
    const course = await courseService.addCourse(
      Course_title,
      Course_category,
      Course_description,
      imageUrl,
      Course_type,
      Modules,
      Course_cost,
      Discount,
      FAQs
    );

    if (!course) {
      return res.status(400).json({ message: "Failed to add the course" });
    }

    return res.status(200).json({ message: "Course added successfully", course });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getCourse = async (req, res) => {
  try {
    const { CourseId } = req.params;

    if (!CourseId) {
      return res.status(400).json({ message: "Please provide course id" });
    }

    const courseinfo = await courseService.getCourseInfo(CourseId);

    if (!courseinfo) {
      return res.status(404).json({ message: "No course found" });
    }

    return res.status(200).json({ message: "Course info fetched successfully", courseinfo });
  } catch (err) {
    console.error("Error getting course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const editCourse = async (req, res) => {

    const {
      Course_title,
      Course_category,
      Course_description,
      Course_type,
      Modules,
      Course_cost,
      Discount,
      FAQs
    } = req.body;
    console.log(req.file);
    console.log(req.params);
    const { courseId } = req.params;
        const imageUrl = req.file ? req.file.path : null;
    if (!courseId) {
      return res.status(400).json({ message: "Please provide a courseId" });
    }

    let data = {};

    if (Course_title) data.Course_title = Course_title;
    if (Course_category) data.Course_category = Course_category;
    if (Course_description) data.Course_description = Course_description;
    if (imageUrl) data.imageUrl = imageUrl;
    if (Course_type) data.Course_type = Course_type;
    if (Modules) data.Modules = Modules;
    if (Course_cost) data.Course_cost = Course_cost;
    if (Discount !== undefined) data.Discount = Discount;
    if (FAQs) data.FAQs = FAQs;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Please provide some fields to update" });
    }

    const updatedData = await courseService.updateCourse(data, courseId);

    return res.status(200).json({ message: "Course updated successfully", updatedData });
  
}

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.body;

    console.log(userId)
    console.log(courseId)

    if (!userId || !courseId) {
      return res.status(404).json({ message: "Please provide all details" });
    }

    const enrolledCourse = await courseService.enrollCourse(userId, courseId);
    res.json({ success: true, message: "Enrolled successfully!", enrolledCourse });
  } catch (err) {
    console.error("Error enrolling course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseService.deleteCourse(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    return res.status(200).json({ message: "All courses fetched successfully", courses });
  } catch (err) {
    console.error("Error getting all courses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getTotalEnrollments=async(req,res)=>{
  const enrollments=await courseService.getTotalEnrollments();

  return res.status(200).json({message:"total enrollments fetched successfully",enrollments});
}

const getCourseEnrollments=async(req,res)=>{
  const {courseId}=req.params;
  const enrollments=await courseService.getCourseEnrollmentCount(courseId);
  return res.status(200).json({message:"course enrollments fetched successfully",enrollments});
}

export { addCourse, getCourse, editCourse, enrollCourse, deleteCourse, getAllCourses, getTotalEnrollments, getCourseEnrollments };