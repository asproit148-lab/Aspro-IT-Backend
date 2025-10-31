import courseService from '../services/courseService.js'

const addCourse=async(req,res)=>{
 const {
      name,
      category,
      price,
      discountedPrice,
      discount,
      learnings,
      skills,
      courseDescription,
      courseFeedback,
      courseFaq,
    } = req.body;

    if (
      !name ||
      !category ||
      !price ||
      !discountedPrice ||
      !learnings ||
      !skills ||
      !courseDescription
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, category, price, discountedPrice, learnings, skills, and courseDescription",
      });
    }
  
  const course=await courseService.addCourse(name,
      category,
      price,
      discountedPrice,
      discount,
      learnings,
      skills,
      courseDescription,
      courseFeedback,
      courseFaq);

    if(!course){
      return res.status(400).json({message:"failed to add the course"});
    }

    return res.status(200).json({message:"course added successfully",course})
  }

const getCourse=async(req,res)=>{
  try{
  const{CourseId}=req.params;

  console.log(CourseId);
  if(!CourseId){
    return res.status(400).json("please provide course id");
  }
  const courseinfo=await courseService.getCourseInfo(CourseId);

  if(!courseinfo || courseinfo==null){
    return res.status(404).json("no course found");
  }
  console.log(courseinfo);
  return res.status(200).json({message:"couse info fetched successfully",courseinfo});
}
   catch (err) {
    console.error("Error getting course:", err);
    res.status(500).json({ message: "Internal server error" });
  }}

const editCourse=async(req,res)=>{
  const {
      name,
      category,
      price,
      discountedPrice,
      discount,
      learnings,
      skills,
      courseDescription,
      courseFeedback,
      courseFaq,
    } = req.body;

    const {courseId}=req.params;
    if(!courseId){
      return res.status(400).json("please provide a courseId");
    }

    let data;

    if(name) data.name=name;
    if(category) data.category=category;
    if(price) data.price=price;
    if(discountedPrice) data.discount=discount;
    if(learnings) data.learnings=learnings;
    if(skills) data.skills=skills;
    if(courseDescription) data.courseDescription=courseDescription;
    if(courseFeedback) data.name=name;
    if(courseFaq) data.courseFaq=courseFaq;

    if(!data==null){
      return res.status(400).json("please provide some fields to update");
    }

    const updatedData=await courseService.updateCourse(data,courseId);

    return res.status(200).json({message:"course updated successfully",updatedData});
}

const enrollCourse = async (req, res) => {
  
    const userId=req.user?._id;
    const {courseId}= req.body;
    console.log(req.body);

    
    if(!userId || !courseId){
      return res.status(404).json({ message: "please provide all details" });
    }
    const enrolledCourse=await courseService.enrollCourse(userId,courseId)
    res.json({ success: true, message: "Enrolled successfully!",enrolledCourse});
};

const deleteCourse=async(req,res)=>{
  const {courseId}=req.params;

  const course=await courseService.deleteCourse(courseId);

  if(!course){
    return res.status(404).json("course not found");
  }

  return res.status(200).json({message:"course deleted successfully"})
}

const getAllCourses=async(req,res)=>{
  const courses=await courseService.getCourses();

  if(!courses){
    return res.status(404).json("no courses found");
  }

  return res.status(200).json({message:"all courses fetched successfully",courses});
}

  export {addCourse,getCourse,editCourse,enrollCourse,deleteCourse,getAllCourses};