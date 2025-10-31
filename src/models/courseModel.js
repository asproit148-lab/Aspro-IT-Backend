import mongoose from 'mongoose';

const courseSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true,

  },
  discountedPrice:{
    type:Number,
    required:true,
  },
  discount:{
    type:Number
  },
  learnings:[String],
  Skills:[String],

  courseDescription:[String],

  courseFeedback:[String],

  courseFaq:[String]
})

const Course=mongoose.model("Course",courseSchema);

export default Course;