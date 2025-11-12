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
  const blog=await Blog.findById(blogId);

 if(!blog){
    throw new Error("blog not found");
  }
  if (file) {
    const uploadResult = await uploadOnCloudinary(file.path);
    Blog.BlogImage= uploadResult.secure_url;
  


  blog.set({
    Blog_title:title,
    Blog_content:content,
  });

  const updatedBlog=await blog.save();

  return updatedBlog;

}
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


export default  {addBlog,updateBlog,deleteBlog,getBlog,getBlogs};
