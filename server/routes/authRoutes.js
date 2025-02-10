//routes/authRoutes.js
const express = require("express");
const { signup, signin, getUserInfo } = require("../controllers/authController");

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user",getUserInfo);

module.exports = router;
