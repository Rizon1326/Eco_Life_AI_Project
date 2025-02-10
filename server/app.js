//app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatbotRoutes = require("./routes/chatbotRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const chatwithRoutes = require("./routes/chatwithRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

// Routes
// app.use("/api/chatbot", chatbotRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatwithRoutes);
mongoose
  .connect("mongodb://localhost:27017/authApp2", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

module.exports = app;
