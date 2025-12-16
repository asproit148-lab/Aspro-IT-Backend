import Groq from "groq-sdk";
import dotenv from "dotenv";
import { searchKnowledgeBase } from "../utils/pineconeSearch.js";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: convert metadata into clean, human-readable text with links
const formatMatchForUser = (match, index) => {
  const { type, ...rest } = match.metadata;

  switch (type) {
    case "contact":
      return `${index}. 📞 Contact Information:
Company: ${rest.name}
Email: ${rest.email}
Phone: ${rest.contact}
Address: ${rest.address}
Location: ${rest.location}
Owner: ${rest.owner}`;

    case "course":
      const courseLink =
        rest.url ||
        `https://asproit.com/courses/${rest.title.replace(/\s+/g, "-").toLowerCase()}`;
      return `${index}. Course: ${rest.title}
Type: ${rest.courseType}
Cost: ₹${rest.cost}
Link: ${courseLink}`;

    case "coupon":
      return `${index}. Coupon Code: ${rest.code || rest.title}
Discount: ${rest.discount}%`;

    case "blog":
      const blogLink =
        rest.url ||
        `https://asproit.com/blogs/${rest.title.replace(/\s+/g, "-").toLowerCase()}`;
      return `${index}. Blog: ${rest.title}
Summary: ${rest.summary || rest.description || "No summary available"}
Link: ${blogLink}`;

    case "resource":
      const resourceLink =
        rest.url ||
        `https://asproit.com/resources/${rest.title.replace(/\s+/g, "-").toLowerCase()}`;
      return `${index}. Resource: ${rest.title}
Description: ${rest.description || "No description available"}
Link: ${resourceLink}`;

    default:
      return `${index}. ${type}: ${rest.title || "No title available"}`;
  }
};

export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) throw new Error("Prompt is required");

    const lowerPrompt = prompt.toLowerCase();

    // ✅ Handle greetings separately
    const greetings = ["hi", "hello", "hey", "good morning", "good afternoon"];
    if (greetings.some((g) => lowerPrompt.includes(g))) {
      return {
        reply: "Hello! 👋 How can I help you today? You can ask me about our courses, resources, coupons, or contact information.",
        buttons: [],
      };
    }

    // 1️⃣ Search Pinecone
    const matches = await searchKnowledgeBase(prompt);

    if (!matches.length) {
      return {
        reply: "I couldn't find relevant information. Please ask about our courses, pricing, contact details, or services.",
        buttons: [],
      };
    }

    // 2️⃣ Build human-readable context
    const formattedContext = matches
      .map((m, i) => formatMatchForUser(m, i + 1))
      .join("\n\n");

    // 3️⃣ System prompt
    const systemPrompt = `
You are AsproIT's official AI assistant.

Rules:
- Answer using ONLY the provided context
- Make answers natural, readable, and friendly
- Use numbering and emojis to list multiple items
- Always include contact information when asked about email, phone, address, or contact
- Always include links for courses, blogs, and resources
- If info is not in the context, say you don't have that info
`;

    // 4️⃣ User prompt
    const userPrompt = `CONTEXT:\n${formattedContext}\n\nQUESTION:\n${prompt}`;

    // 5️⃣ Ask Groq
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 250,
    });

    const reply = chatCompletion.choices[0]?.message?.content || 
                  "I can help with AsproIT courses and services.";

    return { reply: String(reply), buttons: [] };

  } catch (err) {
    console.error("❌ AI ERROR:", err);
    return {
      reply: "Sorry, something went wrong. Please contact support at admin@asproit.com or call +91-9128444000.",
      buttons: [],
    };
  }
};