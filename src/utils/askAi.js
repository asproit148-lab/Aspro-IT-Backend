import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) {
      throw new Error("Prompt is required");
    }

    let context = "";
    try {
      const rawContext = fs.readFileSync("scrapedData.txt", "utf-8");
      
      // Extract key information for better AI understanding
      const phoneMatch = rawContext.match(/\+91[- ]?\d{10}|\d{10}/);
      const emailMatch = rawContext.match(/[\w.-]+@[\w.-]+\.\w+/);
      const addressMatch = rawContext.match(/Address[:\s]+(.*?)(?=Company|Contacts|$)/s);
      
      // Format context with highlighted key info
      context = `
KEY CONTACT INFORMATION:
Phone: ${phoneMatch ? phoneMatch[0] : 'Not found'}
Email: ${emailMatch ? emailMatch[0] : 'Not found'}
Address: ${addressMatch ? addressMatch[1].trim().replace(/\s+/g, ' ') : 'Patna, India'}

FULL WEBSITE CONTENT:
${rawContext}
`;
    } catch (err) {
      console.warn("No scrapedData.txt found. Proceeding without context.");
    }

    const fullPrompt = `You are AsproIt's official website chatbot. Answer questions ONLY using the website content below.

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
${context.slice(0, 20000)}

USER QUESTION: ${prompt}

INSTRUCTIONS:
- If question is about AsproIt (courses, contact, pricing, location, enrollment, services), answer in 1-2 lines using ONLY the website content
- If question is NOT about AsproIt, respond: "I can only answer questions about AsproIt. Please ask about our courses, services, pricing, or contact information."
- NEVER make up information - only use what's in the website content above`;

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
      temperature: 0.3, // Lower temperature for more consistent responses
      max_tokens: 150, // Limit response length
    });

    return chatCompletion.choices[0]?.message?.content || "No response.";
  } catch (err) {
    console.error("Error in askAI:", err);
    throw new Error("Failed to get AI response");
  }
};