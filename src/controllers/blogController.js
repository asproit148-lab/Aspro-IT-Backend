import blogService from '../services/blogService.js';

const addBlog=async(req,res)=>{
  const{title,content,image}=req.body;

  if(!title || !content){
    return res.status(400).json("please provide required information");
  }

  let file;
  if(image){
     file=image;
  }

  const Blog=await blogService.addBlog(title,content,file);

  return res.status(201).json({message:"blog created successfully",Blog});
}

const updateBlog=async(req,res)=>{
  const{title,content,image}=req.body;
  const {blogId}=req.params;

  console.log(req.body);
  console.log(req.params);

  if(!title  || !content){
    return res.status(400).json({message:"please provide a field to update"});
  }
let file;
  if(image){
     file=image;
  }


  const blog=await blogService.updateBlog(title,content,file,blogId);

  if(!blog){
    return res.status(404).json("failed to update blog");
  }

  return res.status(200).json({message:"blog updated successfully",blog});
}

const deleteBlog=async(req,res)=>{
  const {blogId}=req.params;

  const deletedBlog=await blogService.deleteBlog(blogId);

  if(!deletedBlog){
    return res.status(404).json("blog not found")
  }

  return res.status(200).json({message:"blog deleted successfully",deletedBlog});
}

const getBlog=async(req,res)=>{
  const {blogId}=req.params;
  console.log(req.params);

  const blog=await blogService.getBlog(blogId);

  return res.status(200).json({message:"blog fetched successfully",blog});
}

const getBlogs=async(req,res)=>{
  const blogs=await blogService.getBlogs();

  if(!blogs){
    return res.status(200).json("no blogs found")
  }

  return res.status(200).json({message:"All blogs fetched successfully",blogs})
}
const totalBlogs=async(req,res)=>{
  const blogs=await blogService.getAllBlogs();

  return res.status(200).json({"alls blogs fetcjhed successfully":blogs})
}

export {addBlog,updateBlog,deleteBlog,getBlog,getBlogs,totalBlogs};