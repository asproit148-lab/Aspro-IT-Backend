import mongoose from "mongoose";

const questionSchema= new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  url:{
    type:String,
    required:true
  }
});

const Question =mongoose.model('Question',questionSchema);

export default Question;