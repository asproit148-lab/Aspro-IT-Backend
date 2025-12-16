import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {       
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  public_id:{
    type:String
  }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;
