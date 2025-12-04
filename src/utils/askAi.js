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
You are a helpful chatbot for the AsproIt website. Answer only using the information available on the AsproIt website. If a question is not clearly answerable from the site, reply politely with: ‘Please ask relevant questions.’ Never provide unrelated or external information, even if asked or forced. Keep every answer within one or two lines and speak as if AsproIt is your own website.
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
