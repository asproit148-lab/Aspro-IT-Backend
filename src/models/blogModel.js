import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  Blog_title: {
    type: String,
    required: true,
  },
  Blog_content: {
    type: String,
    required: true,
  },
  BlogImage: {
    type: String,
  },
  
},{timeStamps:true});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
