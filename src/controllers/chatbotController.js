import chatbotService from '../services/chatbotService.js' 
 
 const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await chatbotService.getChatbotResponse(message);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chatbot Error:", err);
    return res.status(500).json({ error: "Failed to get response" });
  }
};

export default askChatbot;