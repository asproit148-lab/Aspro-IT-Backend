import { askAI } from "../utils/askiAI.js";


const getChatbotResponse=async(message)=>{
   const reply = await askAI(message);

   return reply;
}

export default {getChatbotResponse};