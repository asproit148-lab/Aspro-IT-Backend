import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()){
       throw new Error("Prompt is required");
    }

    let context = "";
    try {
      context = fs.readFileSync("scrapedData.txt", "utf-8");
    } catch (err) {
      console.warn("No scrapedData.txt found. Proceeding without context.");
    }

    const fullPrompt = `
You are a helpful chatbot for a the AsproIt website.
Answer user questions based on the following website content.
If the answer is not clearly available, politely say Please ask relevant questions.
Answer like its your own website not others
Give one to two lines answers max"

Website Content:
${context.slice(0, 12000)}  

User Question:
${prompt}
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: fullPrompt }],
    });

    return chatCompletion.choices[0]?.message?.content || "No response.";
  } catch (err) {
    console.error("Error in askAI:", err);
    throw new Error("Failed to get AI response");
  }
};
