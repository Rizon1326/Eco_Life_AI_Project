// controllers/chatwithController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDJaIv8Ed5RDrDGsAl36-EGmAp4gjpUTx8");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Modify the prompt to always ask for a response in Bangla
    const prompt = `তুমি একজন সাহায্যকারী সহকারী। নিচে দেওয়া বার্তার উত্তর দাও: ${message}`;
    
    const result = await model.generateContent(prompt);

    // Returning the response from the model
    res.status(200).json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
};

module.exports = { chatWithBot };
