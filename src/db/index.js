import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // This will load variables from .env

const connectDB= async()=>{
  try{

    const connectionMongo=await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`mongodb connected successfully !! at db host:${connectionMongo.connection.host}`)

  }
  catch(error){
    console.log("mongoose connection error",error)
    process.exit(1);
  }
}
  
export{connectDB};