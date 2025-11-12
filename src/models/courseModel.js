import mongoose from 'mongoose';

const courseSchema=new mongoose.Schema({
  Course_category:{
    type:String,
    required:true
  },
  Course_title:{
    type:String,
    required:true,

  },
  Course_description:{
    type:String,
    required:true,
  },
  imageUrl:{
    type:String
  },
  Course_type:{
    type:String,
    enum:["Live","Recorded"],
    required:true,
  },
  Modules:[
    {
      module_name:String,
      module_description:String
    }
  ],
  Course_cost:{
    type:String
  },
  Discount:{
    type:Number
  },
  Final_cost:{
    type:Number,
    required:true
  },
  FAQs:[
    {
      question:String,
      answer:String
    }
  ],
})

courseSchema.pre("save",function(next){
  this.Final_cost=this.Course_cost-this.Discount
  next();
});

const Course=mongoose.model("Course",courseSchema);

export default Course;