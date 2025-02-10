//routes/chatbotRoutes.js
const express = require("express");
const { chatbotResponse } = require("../controllers/chatbotController");
// const { chatWithBot } = require("../controllers/chatwithController");

const router = express.Router();

// POST route for chatbot response
router.post("/response", chatbotResponse);
// router.post("/", chatWithBot);

module.exports = router;
