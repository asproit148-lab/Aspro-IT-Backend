import Blog from '../models/blogModel.js';

const addBlog=async(title,content,author,file)=>{

  const blog= Blog.create({title,content,author,file});

  return blog;
}

const updateBlog=async(title,content,file,blogId)=>{
  const blog=await Blog.findById(blogId);

 if(!blog){
    throw new Error("blog not found");
  }


  blog.set(title,content,file);

  const updatedBlog=await blog.save();

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

export default  {addBlog,updateBlog,deleteBlog,getBlog,getBlogs};
