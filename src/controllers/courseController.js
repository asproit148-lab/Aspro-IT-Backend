import courseService from "../services/courseService.js";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : [];
  } catch (err) {
    return [];
  }
};

const addCourse = async (req, res) => {
  try {
    const {
      Course_title,
      Course_description,
      Course_type,
      Course_cost,
      Discount,
    } = req.body;

    if (!Course_title || !Course_description || !Course_type || !Course_cost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse Arrays Safely
    const Skills = safeParse(req.body.Skills);
    const Modules = safeParse(req.body.Modules);
    const FAQs = safeParse(req.body.FAQs);

    // File
    const imageUrl = req.file ? req.file.path : null;
    console.log("Received Image File Path:", imageUrl);
    const course = await courseService.addCourse({
      Course_title,
      Course_description,
      Course_type,
      Skills,
      Modules,
      Course_cost,
      Discount: Discount || 0,
      FAQs,
      imageUrl,
    });
    console.log("New Course Added:", course);
    res.status(201).json({ success: true, message: "Course Added", course });
  } catch (err) {
    console.error("ADD COURSE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCourse = async (req, res) => {
  try {
    const { CourseId } = req.params;
    const course = await courseService.getCourseInfo(CourseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ success: true, course });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const imageFile = req.file?.path || null;

    const updated = await courseService.updateCourse(courseId, req.body, imageFile);

    res.json({ success: true, message: "Course Updated", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deleted = await courseService.deleteCourse(req.params.courseId);

    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.json({ success: true, message: "Course deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.body;

    const enrolled = await courseService.enrollCourse(userId, courseId);

    res.json({ success: true, enrolled });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllCourses = async (req, res) => {
  const courses = await courseService.getCourses();
  res.json({ success: true, courses });
};

const getTotalEnrollments = async (req, res) => {
  const count = await courseService.getTotalEnrollments();
  res.json({ success: true, total: count });
};

const totalCourse=async(req,res)=>{
  const count = await courseService.getTotalCourses();
  res.json({ success: true, total: count });
}

const getCourseEnrollments = async (req, res) => {
  const count = await courseService.getCourseEnrollmentCount(req.params.courseId);
  res.json({ success: true, count });
};

export {
  addCourse,
  getCourse,
  editCourse,
  enrollCourse,
  deleteCourse,
  getAllCourses,
  getTotalEnrollments,
  getCourseEnrollments,
  totalCourse

};
