import app from "./app.js";
import {connectDB} from "./db/index.js";

import dotenv from 'dotenv';

dotenv.config();


const PORT=process.env.PORT || 3000;



// start server
connectDB()
.then(()=>{

app.listen(PORT, ()=>{
  console.log(` Server running on http://localhost:${PORT}`);
});

})

.catch((err)=>{
  console.log("mongoDB connection failed",err);

})
