import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) throw new Error("Prompt is required");

    let context = "";
    try {
      context = fs.readFileSync("src/utils/scrapedData.txt", "utf-8");
      console.log("File loaded successfully. Size:", context.length);
    } catch (err) {
      console.warn("No scrapedData.txt found. Using empty context.");
    }

    // ---------------------
    // SYSTEM PROMPT (rules)
    // ---------------------
    const systemPrompt = `
You are AsproIt's strict website chatbot.
You MUST answer ONLY using the website data provided below.
Never guess, never invent information.

WHAT YOU CAN ANSWER:
- Courses (Python, AI, Cloud, DevOps, Data Analytics, Cyber Security)
- Pricing
- Contact info (email, phone, address)
- Internships, placement, trial classes
- Enrollment process
- Company info

WHAT YOU MUST REJECT:
- General knowledge
- Programming help
- Anything not found inside the website data
- Personal advice
- Tech explanations unrelated to AsproIt

STRICT RULE:
If the information is NOT inside the website data, respond:
"I can only answer questions about AsproIt based on the website content provided."
`;

    // ---------------------
    // CONTEXT (scraped data)
    // ---------------------
    const contextPrompt = `
WEBSITE DATA (source of truth):
${context}
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: contextPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    return chatCompletion.choices[0]?.message?.content || "No response.";

  } catch (err) {
    console.error("Error in askAI:", err);
    throw new Error("Failed to get AI response");
  }
};
