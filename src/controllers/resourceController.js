import * as resourceService from '../services/resourceService.js';
const addResource=async(req,res)=>{
  try {
    const{title,description}=req.body
    const filePath=req.file?req.file.path:null;


    if(!title || !description || !filePath){
      return res.status(400).json({error:"please provide all fields"})
    }
    const resource=await resourceService.addResource(title,filePath,description);
    return res.status(200).json({message:"resource added successfully",resource});
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { addResource };