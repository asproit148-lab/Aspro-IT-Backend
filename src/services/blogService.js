import Blog from '../models/blogModel.js';
import { uploadOnCloudinary } from "../utils/uploadImage.js";

const addBlog=async(title,content,file)=>{
  let BlogImage = null;

  if (file) {
    const uploadResult = await uploadOnCloudinary(file.path);
    BlogImage= uploadResult.secure_url;
  

  const blog= Blog.create({
    Blog_title:title,
    Blog_content:content,
    BlogImage:BlogImage});

  return blog;
}
}

const updateBlog=async(title,content,file,blogId)=>{
    // 1. Fetch the existing blog document
    const blog=await Blog.findById(blogId);

    if(!blog){
        throw new Error("Blog not found");
    }

    // 2. Handle Image Update
    if (file) {
        const uploadResult = await uploadOnCloudinary(file.path);
        // *** CRITICAL FIX: Update the specific document's property ***
        blog.BlogImage = uploadResult.secure_url; 
    }

    // 3. Update Text Content (can be outside the file check)
    // Update the properties directly on the document
    blog.Blog_title = title; 
    blog.Blog_content = content;
    
    // 4. Save the changes
    const updatedBlog = await blog.save();

    return updatedBlog;
}

const deleteBlog=async(blogId)=>{
  const blog=await Blog.findByIdAndDelete(blogId);
  
  
  return blog;

}

const getBlog=async(blogId)=>{
  const blog=await Blog.findById(blogId);

  if(!blog){
    throw new Error("blog not found");
  }

  return blog;
}

const getBlogs=async()=>{
  const blog=await Blog.find();

  if(!blog){
    throw new Error("no blog found");
  }

  return blog
}

const getAllBlogs=async()=>{
  const allBlogs=await Blog.countDocuments();

  return allBlogs;
}


export default  {addBlog,updateBlog,deleteBlog,getBlog,getBlogs,getAllBlogs};