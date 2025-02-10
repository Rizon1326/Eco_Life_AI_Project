//routes/chatwithRoutes.js
const express = require("express");
const { chatWithBot } = require("../controllers/chatwithController");

const router = express.Router();

router.post("/", chatWithBot);

module.exports = router;
