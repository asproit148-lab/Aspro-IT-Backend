import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Parse website content
const parseWebsiteContent = (content) => {
  const data = { urls: {}, courses: [], contact: {} };
  
  try {
    // Extract URLs
    const urlMatches = content.match(/https:\/\/aspro-it-frontend\.vercel\.app\/[^\s\])]*/g) || [];
    urlMatches.forEach(url => {
      if (url.includes('/contact')) data.urls.contact = url;
      else if (url.includes('enrollment')) data.urls.enrollment = url;
      else if (url.includes('live-learning')) data.urls.courses = url;
      else if (!data.urls.home) data.urls.home = url.replace(/#.*$/, '');
    });

    // Extract courses
    const validCourses = ['Python Programming', 'Cyber security', 'Generative AI', 'DevOps', 'Cloud Computing', 'Data Analytics'];
    
    for (const courseName of validCourses) {
      const courseRegex = new RegExp(`${courseName}[^]*?(Online|Offline)[^]*?₹(\\d+)[^]*?₹(\\d+)`, 'i');
      const match = content.match(courseRegex);
      
      if (match) {
        data.courses.push({
          name: courseName,
          mode: match[1],
          price: `₹${match[2]}`,
          original: `₹${match[3]}`
        });
      }
    }

    // Extract contact
    const phoneMatch = content.match(/\+91-?\d{10}/);
    if (phoneMatch) data.contact.phone = phoneMatch[0];
    
    const emailMatch = content.match(/admin@asproit\.com/);
    if (emailMatch) data.contact.email = emailMatch[0];
    
    const addressMatch = content.match(/1st Floor, Pratiksha,[^]*?Patna, India-800014/);
    if (addressMatch) data.contact.address = addressMatch[0].replace(/\s+/g, ' ').trim();
    
  } catch (err) {
    console.error("Parse error:", err);
  }
  
  return data;
};

// Detect intent
const detectIntent = (message) => {
  const msg = message.toLowerCase().trim();
  const words = msg.split(/\s+/);
  
  // Simple greetings only
  const greetings = ['hi', 'hello', 'hey', 'hii', 'helo', 'namaste'];
  if (words.length <= 2 && greetings.some(g => words.includes(g))) {
    return 'greeting';
  }
  
  // Contact
  if (/(contact|phone|mobile|call|email|mail|address|location|reach)/i.test(msg)) {
    return 'contact';
  }
  
  // Course list
  if (/(all courses|what courses|list courses|show courses|your courses)/i.test(msg)) {
    return 'courses_list';
  }
  
  // Specific course
  if (/(python|cyber|security|ai|devops|cloud|data|analytics)/i.test(msg)) {
    return 'course_detail';
  }
  
  // Pricing
  if (/(price|cost|fee|discount|offer|much)/i.test(msg)) {
    return 'pricing';
  }
  
  return 'general';
};

// Format responses with buttons
const formatResponse = (intent, aiResponse, userMessage, websiteData) => {
  let reply = '';
  let buttons = [];
  
  switch(intent) {
    case 'greeting':
      reply = `Hi there! 👋 Welcome to **AsproIT**.\n\n`;
      reply += `We offer live expert-led training in Python, Cyber Security, Generative AI, DevOps, Cloud Computing & Data Analytics.\n\n`;
      reply += `🔥 **40% OFF** on all courses right now!\n\n`;
      reply += `What would you like to know?`;
      
      if (websiteData.urls.courses) {
        buttons.push({ text: '📚 View Courses', url: websiteData.urls.courses });
      }
      if (websiteData.urls.enrollment) {
        buttons.push({ text: '🚀 Enroll Now', url: websiteData.urls.enrollment });
      }
      break;
      
    case 'contact':
      reply = `📞 **Contact Us**\n\n`;
      
      if (websiteData.contact.phone) {
        reply += `**Phone:** ${websiteData.contact.phone}\n`;
      }
      if (websiteData.contact.email) {
        reply += `**Email:** ${websiteData.contact.email}\n`;
      }
      if (websiteData.contact.address) {
        reply += `**Address:** ${websiteData.contact.address}\n`;
      }
      
      reply += `\nWe're here to help! 😊`;
      
      if (websiteData.urls.contact) {
        buttons.push({ text: '📍 Visit Contact Page', url: websiteData.urls.contact });
      }
      break;
      
    case 'courses_list':
      if (websiteData.courses.length > 0) {
        reply = `🎓 **Our Courses** (40% OFF)\n\n`;
        
        websiteData.courses.forEach((course, i) => {
          reply += `**${i + 1}. ${course.name}**\n`;
          reply += `${course.price} ~~${course.original}~~ • ${course.mode}\n\n`;
        });
        
        reply += `All courses include live classes, study materials, mock interviews, internships & placement support.\n\n`;
        reply += `Limited seats available!`;
        
        if (websiteData.urls.enrollment) {
          buttons.push({ text: '🎯 Enroll Now', url: websiteData.urls.enrollment });
        }
      }
      break;
      
    case 'course_detail':
    case 'pricing':
      const msg = userMessage.toLowerCase();
      let foundCourse = null;
      
      for (const course of websiteData.courses) {
        const name = course.name.toLowerCase();
        if (
          (msg.includes('python') && name.includes('python')) ||
          ((msg.includes('cyber') || msg.includes('security')) && name.includes('security')) ||
          (msg.includes('ai') && name.includes('ai')) ||
          (msg.includes('devops') && name.includes('devops')) ||
          (msg.includes('cloud') && name.includes('cloud')) ||
          ((msg.includes('data') || msg.includes('analytics')) && name.includes('analytics'))
        ) {
          foundCourse = course;
          break;
        }
      }
      
      if (foundCourse) {
        reply = `🔥 **${foundCourse.name}**\n\n`;
        reply += `**Price:** ${foundCourse.price} ~~${foundCourse.original}~~ **(40% OFF)**\n`;
        reply += `**Mode:** ${foundCourse.mode} | Bilingual\n\n`;
        reply += `✅ Live classes, study materials, mock interviews, internship & placement support included.\n\n`;
        reply += `⚡ Limited seats! Enroll now to secure your spot.`;
        
        if (websiteData.urls.enrollment) {
          buttons.push({ text: '🚀 Enroll Now', url: websiteData.urls.enrollment });
        }
      } else if (websiteData.courses.length > 0) {
        reply = `💰 **Course Pricing** (40% OFF)\n\n`;
        
        websiteData.courses.forEach((course, i) => {
          reply += `**${course.name}:** ${course.price} ~~${course.original}~~\n`;
        });
        
        reply += `\nAll courses include complete training & placement support!`;
        
        if (websiteData.urls.enrollment) {
          buttons.push({ text: '🎯 Enroll Now', url: websiteData.urls.enrollment });
        }
      }
      break;
      
    default:
      reply = aiResponse;
      
      if (websiteData.urls.courses) {
        buttons.push({ text: '📚 Browse Courses', url: websiteData.urls.courses });
      }
      if (websiteData.urls.contact) {
        buttons.push({ text: '📞 Contact Us', url: websiteData.urls.contact });
      }
  }
  
  // Return object with reply and buttons
  return {
    reply: reply,
    buttons: buttons
  };
};

// Main AI function
export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) {
      throw new Error("Prompt is required");
    }

    let context = "";
    let websiteData = { urls: {}, courses: [], contact: {} };
    
    try {
      const filePath = path.join(process.cwd(), "src/scrapedData.txt");
      context = fs.readFileSync(filePath, "utf-8");
      websiteData = parseWebsiteContent(context);
    } catch (err) {
      console.warn("⚠️ Could not read scrapedData.txt");
    }

    const intent = detectIntent(prompt);

    // Handle predefined intents
    if (['greeting', 'contact', 'courses_list', 'course_detail', 'pricing'].includes(intent)) {
      return formatResponse(intent, '', prompt, websiteData);
    }

    // Use AI for general queries
    const systemPrompt = `You are AsproIT's chatbot. Answer briefly in 2-3 sentences max.

Rules:
- Only answer about AsproIT courses, services, pricing, contact
- Be warm and helpful
- If not about AsproIT, say: "I can only help with AsproIT courses and services. What would you like to know?"
- Never make up info`;

    const userPrompt = `WEBSITE:\n${context}\n\nQUESTION: ${prompt}`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 120,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content?.trim() || 
      "I'm here to help with AsproIT courses and services. What would you like to know?";

    return formatResponse('general', aiResponse, prompt, websiteData);

  } catch (err) {
    console.error("❌ Error:", err);
    return {
      reply: "Sorry, something went wrong. Please contact us at +91-9128444000",
      buttons: []
    };
  }
};