import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Parse website content dynamically
const parseWebsiteContent = (content) => {
  const data = {
    urls: {},
    courses: [],
    contact: {},
    services: []
  };

  try {
    // Extract URLs dynamically
    const urlMatches = content.match(/https:\/\/[^\s\]]+/g) || [];
    urlMatches.forEach(url => {
      if (url.includes('/contact')) data.urls.contact = url;
      else if (url.includes('/courses/enrollment') || url.includes('enrollment')) data.urls.enrollment = url;
      else if (url.includes('#live-learning') || url.includes('/courses')) data.urls.courses = url;
      else if (url.includes('vercel.app') && !data.urls.home) data.urls.home = url.split('#')[0].split('?')[0];
    });

    // Extract courses dynamically
    const coursePattern = /([A-Za-z\s]+(?:Programming|security|AI|DevOps|Computing|Analytics))[^\n]*?(?:Bilingual|Online|Offline)[^\n]*?(Online|Offline)[^\n]*?₹([\d.]+)[^\n]*?₹([\d.]+)[^\n]*?(\d+)% OFF/gi;
    let match;
    while ((match = coursePattern.exec(content)) !== null) {
      data.courses.push({
        name: match[1].trim(),
        mode: match[2],
        discountedPrice: `₹${Math.round(parseFloat(match[3]))}`,
        originalPrice: `₹${Math.round(parseFloat(match[4]))}`,
        discount: `${match[5]}% OFF`
      });
    }

    // Remove duplicates
    data.courses = data.courses.filter((course, index, self) =>
      index === self.findIndex(c => c.name === course.name)
    );

    // Extract contact information dynamically
    const phoneMatch = content.match(/\+?\d{1,3}[-.\s]?\d{10}|\+?\d{10,}/);
    if (phoneMatch) data.contact.phone = phoneMatch[0].replace(/\s/g, '');

    const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) data.contact.email = emailMatch[0];

    const addressMatch = content.match(/(?:Address|Location)[:\s]*([^\n]+(?:Patna|India)[^\n]*)/i);
    if (addressMatch) data.contact.address = addressMatch[1].trim().replace(/Company.*$/i, '');

    // Extract services dynamically
    const servicesPattern = /(?:Courses|Self Material|Mock Interview|Internship|Jobs|Live.*?Classes|Study Material|Placement)/gi;
    const servicesFound = new Set();
    let serviceMatch;
    while ((serviceMatch = servicesPattern.exec(content)) !== null) {
      servicesFound.add(serviceMatch[0]);
    }
    data.services = Array.from(servicesFound);

  } catch (err) {
    console.error("Error parsing content:", err);
  }

  return data;
};

// Detect intent from user message
const detectIntent = (message) => {
  const msg = message.toLowerCase().trim();
  
  const greetings = ['hi', 'hello', 'hey', 'hii', 'helo', 'namaste', 'good morning', 'good evening'];
  if (greetings.some(g => msg === g || msg.startsWith(g + ' ') || msg.endsWith(' ' + g))) {
    return 'greeting';
  }
  
  const contactKeywords = ['contact', 'phone', 'mobile', 'number', 'call', 'email', 'mail', 'address', 'location', 'where', 'reach'];
  if (contactKeywords.some(k => msg.includes(k))) {
    return 'contact';
  }
  
  const coursesKeywords = ['courses', 'all courses', 'what courses', 'available courses', 'list courses', 'show courses'];
  if (coursesKeywords.some(k => msg.includes(k))) {
    return 'courses_list';
  }
  
  const courseNames = ['python', 'cyber', 'security', 'ai', 'generative', 'devops', 'cloud', 'data analytics', 'analytics'];
  if (courseNames.some(c => msg.includes(c))) {
    return 'course_detail';
  }
  
  if (msg.includes('price') || msg.includes('cost') || msg.includes('fee') || msg.includes('discount') || msg.includes('offer')) {
    return 'pricing';
  }
  
  return 'general';
};

// Format response - Returns ONLY "reply" field as string (frontend expects res.reply)
const formatResponse = (intent, aiResponse, userMessage, websiteData) => {
  let reply = aiResponse;
  
  switch(intent) {
    case 'greeting':
      reply = `👋 Welcome to AsproIT!\n\n` +
        `We offer Future-Ready Skills, On Your Schedule. Join thousands of students worldwide who choose AsproIT to learn, grow, and succeed.\n\n`;
      
      if (websiteData.courses.length > 0) {
        reply += `🎓 Our Courses:\n`;
        websiteData.courses.forEach(course => {
          reply += `• ${course.name}\n`;
        });
        reply += `\n`;
      }
      
      if (websiteData.services.length > 0) {
        reply += `💼 We provide:\n`;
        websiteData.services.slice(0, 6).forEach(service => {
          reply += `• ${service}\n`;
        });
        reply += `\n`;
      }
      
      reply += `How can I help you today?`;
      
      // Add clickable links in text format
      if (websiteData.urls.courses || websiteData.urls.enrollment) {
        reply += `\n\n`;
        if (websiteData.urls.courses) {
          reply += `🔗 View All Courses: ${websiteData.urls.courses}\n`;
        }
        if (websiteData.urls.enrollment) {
          reply += `🚀 Enroll Now: ${websiteData.urls.enrollment}`;
        }
      }
      break;
      
    case 'contact':
      reply = `📞 Contact Information\n\n`;
      
      if (websiteData.contact.phone) {
        reply += `Phone: ${websiteData.contact.phone}\n`;
      }
      
      if (websiteData.contact.email) {
        reply += `Email: ${websiteData.contact.email}\n`;
      }
      
      if (websiteData.contact.address) {
        reply += `Address: ${websiteData.contact.address}\n`;
      }
      
      reply += `\nFeel free to reach out to us anytime!`;
      
      // Add clickable links in text
      if (websiteData.urls.contact) {
        reply += `\n\n🗺️ Visit Contact Page: ${websiteData.urls.contact}`;
      }
      break;
      
    case 'courses_list':
      if (websiteData.courses.length > 0) {
        const discount = websiteData.courses[0]?.discount || 'Special Discount';
        reply = `🎓 Our Premium Courses (${discount} - Limited Time!)\n\n`;
        
        websiteData.courses.forEach((course, i) => {
          reply += `${i + 1}. ${course.name}\n` +
            `   💰 ${course.discountedPrice} (was ${course.originalPrice})\n` +
            `   📍 ${course.mode} | Bilingual\n\n`;
        });
        
        reply += `✨ All courses include:\n`;
        if (websiteData.services.length > 0) {
          websiteData.services.slice(0, 5).forEach(service => {
            reply += `• ${service}\n`;
          });
        }
        
        // Add links in text
        reply += `\n`;
        if (websiteData.urls.courses) {
          reply += `🔥 View All Courses: ${websiteData.urls.courses}\n`;
        }
        if (websiteData.urls.enrollment) {
          reply += `🚀 Enroll Now: ${websiteData.urls.enrollment}`;
        }
      } else {
        reply = `We offer premium IT courses with live classes, study materials, and placement support!`;
      }
      break;
      
    case 'course_detail':
    case 'pricing':
      const msg = userMessage.toLowerCase();
      let foundCourse = null;
      
      // Find matching course dynamically
      for (const course of websiteData.courses) {
        const courseName = course.name.toLowerCase();
        if (
          (msg.includes('python') && courseName.includes('python')) ||
          (msg.includes('cyber') && courseName.includes('cyber')) ||
          (msg.includes('security') && courseName.includes('security')) ||
          (msg.includes('ai') && courseName.includes('ai')) ||
          (msg.includes('generative') && courseName.includes('generative')) ||
          (msg.includes('devops') && courseName.includes('devops')) ||
          (msg.includes('cloud') && courseName.includes('cloud')) ||
          (msg.includes('data') && courseName.includes('data')) ||
          (msg.includes('analytics') && courseName.includes('analytics'))
        ) {
          foundCourse = course;
          break;
        }
      }
      
      if (foundCourse) {
        reply = `🔥 ${foundCourse.name} - Limited Time Offer!\n\n` +
          `💰 Special Price: ${foundCourse.discountedPrice}\n` +
          `Original: ${foundCourse.originalPrice} - Save ${foundCourse.discount}!\n` +
          `📍 Mode: ${foundCourse.mode} | Bilingual\n\n` +
          `✅ What's Included:\n`;
        
        if (websiteData.services.length > 0) {
          websiteData.services.slice(0, 5).forEach(service => {
            reply += `• ${service}\n`;
          });
        }
        
        reply += `\n⏰ Don't miss out! Seats are filling fast. Enroll today and kickstart your career! 🚀`;
        
        // Add links in text
        reply += `\n\n`;
        if (websiteData.urls.enrollment) {
          reply += `🎯 Enroll Now: ${websiteData.urls.enrollment}\n`;
        }
        if (websiteData.urls.courses) {
          reply += `📚 View All Courses: ${websiteData.urls.courses}`;
        }
      } else if (websiteData.courses.length > 0) {
        reply = `💰 Course Pricing (Limited Time Offer!)\n\n`;
        websiteData.courses.forEach(course => {
          reply += `${course.name}\n` +
            `${course.discountedPrice} (was ${course.originalPrice}) | ${course.mode}\n\n`;
        });
        reply += `⚡ All courses are bilingual and include comprehensive training!\n\n` +
          `🔥 Hurry! Limited seats available!`;
        
        // Add links in text
        reply += `\n\n`;
        if (websiteData.urls.enrollment) {
          reply += `🚀 Enroll Now: ${websiteData.urls.enrollment}\n`;
        }
        if (websiteData.urls.courses) {
          reply += `📖 View Course Details: ${websiteData.urls.courses}`;
        }
      }
      break;
      
    default:
      reply = aiResponse;
      if (aiResponse.includes("can only answer questions about AsproIt")) {
        reply += `\n\n`;
        if (websiteData.urls.home) {
          reply += `🏠 Homepage: ${websiteData.urls.home}\n`;
        }
        if (websiteData.urls.courses) {
          reply += `📚 Browse Courses: ${websiteData.urls.courses}`;
        }
      }
  }
  
  // Return ONLY reply string (frontend expects res.reply)
  return { reply: reply };
};

export const askAI = async (prompt) => {
  try {
    if (!prompt?.trim()) {
      throw new Error("Prompt is required");
    }

    // Read and parse website content
    let context = "";
    let websiteData = { urls: {}, courses: [], contact: {}, services: [] };
    
    try {
      const filePath = path.join(process.cwd(), "src/scrapedData.txt");
      context = fs.readFileSync(filePath, "utf-8");
      websiteData = parseWebsiteContent(context);
      console.log("✅ Dynamic data extracted:", {
        courses: websiteData.courses.length,
        urls: Object.keys(websiteData.urls).length,
        hasContact: !!websiteData.contact.phone
      });
    } catch (err) {
      console.warn("⚠️ Could not read scrapedData.txt:", err.message);
    }

    // Detect user intent
    const intent = detectIntent(prompt);
    console.log(`🎯 Detected intent: ${intent}`);

    // Handle special cases with dynamic data
    if (['greeting', 'contact', 'courses_list', 'course_detail', 'pricing'].includes(intent)) {
      return formatResponse(intent, '', prompt, websiteData);
    }

    // For general queries, use AI
    const fullPrompt = `You are AsproIT's official chatbot. Answer ONLY using the website content below.

WEBSITE CONTENT:
${context}

USER QUESTION: ${prompt}

RULES:
- If about AsproIT (courses, pricing, contact, enrollment), answer in 2-3 clear sentences
- If NOT about AsproIT, say: "I can only answer questions about AsproIT. Please ask about our courses, services, pricing, or contact information."
- Be helpful and encouraging
- Never make up information`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful AsproIT chatbot that only answers questions about AsproIT courses and services."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm here to help! Please ask about our courses or services.";
    return formatResponse('general', aiResponse, prompt, websiteData);
    
  } catch (err) {
    console.error("❌ Error in askAI:", err);
    return {
      reply: "Sorry, I encountered an error. Please try again or contact our support team."
    };
  }
};
