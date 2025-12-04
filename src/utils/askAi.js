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
      context = fs.readFileSync("scrapedData.txt", "utf-8");
    } catch (err) {
      console.warn("No scrapedData.txt found. Proceeding without context.");
    }

    const fullPrompt = `You are AsproIt's official website chatbot. You must ONLY answer questions using information explicitly found in the website content below.

STRICT RULES:
1. If the question is about AsproIt services, products, team, contact info, or anything mentioned on the website - answer it concisely in 1-2 lines
2. If the question cannot be answered from the website content - respond EXACTLY with: "I can only answer questions about AsproIt based on our website. Please ask about our services, products, or company information."
3. NEVER answer questions about: general knowledge, other companies, how-to guides, definitions, news, or anything not on the AsproIt website
4. NEVER make up information - only use what's in the website content
5. If unsure whether website contains the answer, say you don't have that information

WEBSITE CONTENT:
${context.slice(0, 15000)}

USER QUESTION: ${prompt}

Remember: ONLY answer if the information is clearly in the website content above. Otherwise, use the standard redirect message.`;

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