import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Admin" if only admins post
    required: true,
  },
  imageUrl: {
    type: String,
  },
  
},{timeStamps:true});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
