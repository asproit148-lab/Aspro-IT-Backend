import { askAI } from "../utils/askAi.js";


const getChatbotResponse=async(message)=>{
   const reply = await askAI(message);

   return reply;
}

export default {getChatbotResponse};