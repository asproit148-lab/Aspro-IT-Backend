import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log("🌟");
export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) {
      throw new Error("Prompt is required");
    }

    let context = "";
    try {
      console.log("➡️ process.cwd():", process.cwd());
console.log("➡️ __dirname:", __dirname);

const filePath = path.join(__dirname, "scrapedData.txt");
console.log("Looking for file at:", filePath);
context = fs.readFileSync(filePath, "utf-8");
      
      console.log("✅ File read successfully!");
      console.log("📊 File size:", context.length, "characters");
      console.log("📄 Preview:", context.slice(0, 200) + "...\n");
      
    } catch (err) {
      console.error("❌ Error reading file:", err.message);
      console.warn("⚠️ No scrapedData.txt found. Proceeding without context.");
    }

    const fullPrompt = `You are AsproIt's official website chatbot. Answer questions ONLY using the website content below and asproIt is your own website.

WHAT TO ANSWER (Questions about AsproIt):
- Courses offered (Python, AI, DevOps, Cloud, Data Analytics, Cyber Security, etc.)
- Pricing and discounts
- Contact information (phone, email, address, location)
- Training modes (online/offline/bilingual)
- Services (internships, mock interviews, job placement, self material)
- Company information and mission
- How to enroll or join trial classes

WHAT TO REJECT (Anything else):
- General knowledge questions (capitals, history, science, definitions)
- Other companies or competitors
- How-to guides unrelated to AsproIt  
- Personal advice (health, finance, relationships)
- Current events or news
- Technical tutorials not specific to AsproIt's offerings

WEBSITE CONTENT:
${context}

USER QUESTION: ${prompt}

INSTRUCTIONS:
- Read the ENTIRE website content carefully above
- If question is about AsproIt (courses, contact, pricing, location, enrollment, services), find the answer in the content and respond in 1-2 clear lines
- Look for phone numbers in formats like: +91-9128444000 or similar
- Look for email addresses ending in .com or similar domains
- Look for addresses mentioning city names like Patna, India
- If question is NOT about AsproIt, respond: "I can only answer questions about AsproIt. Please ask about our courses, services, pricing, or contact information."
- NEVER make up information - only use what you find in the website content above`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a strict website chatbot that ONLY answers questions based on provided website content. You refuse to answer any question not related to the website information given to you."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: 0.1, // Even lower for more accuracy
      max_tokens: 200, // Slightly more room for complete answers
    });

    return chatCompletion.choices[0]?.message?.content || "No response.";
  } catch (err) {
    console.error("Error in askAI:", err);
    throw new Error("Failed to get AI response");
  }
};