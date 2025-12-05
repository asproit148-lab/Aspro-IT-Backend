import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";


dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) throw new Error("Prompt is required");
const filePath = path.join(process.cwd(), "src", "utils", "scrapedData.txt");

    let context = "";
    try {
      context = fs.readFileSync(filePath, "utf-8");
      console.log(context);
    } catch (err) {
      console.warn("⚠️ scrapedData.txt missing, using empty context.");
    }

    // ---------------------
    // STRICT BUT DYNAMIC SYSTEM PROMPT
    // ---------------------
    const systemPrompt = `
You are AsproIt's official chatbot.
You must answer using ONLY the website data provided.
Do NOT hallucinate or invent any information.

RULES:
- If the user's question CAN be answered using the website data, answer in 1–2 lines.
- If the answer does NOT exist in the website data, reply:
  "I can only answer questions based on the information provided on AsproIt's website."

ALLOWED QUESTIONS:
- Courses
- Contact details
- Pricing
- Address
- Internships / placement
- Training modes
- Enrollment

FORBIDDEN:
- Off-topic questions (history, general knowledge, coding help)
`;

    // ---------------------
    // PUT WEBSITE CONTENT AS ASSISTANT MESSAGE = KNOWLEDGE
    // ---------------------
    const knowledgeMessage = {
      role: "assistant",
      content: `ASPROIT WEBSITE DATA:\n${context}`
    };

    // ---------------------
    // AI CALL
    // ---------------------
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        knowledgeMessage,
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    return chatCompletion.choices[0]?.message?.content || "No response.";
    
  } catch (err) {
    console.error("Error in askAI:", err);
    throw new Error("Failed to get AI response");
  }
};
