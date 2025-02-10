//controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create and save a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login a user
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET_KEY", {
      expiresIn: "1h",
    });

    res.status(200).json({ 
      message: "Login successful", token,
      userName: user.username, // Send username
      userEmail: user.email
     });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    const user = await User.findById(decoded.id).select("username email");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      userName: user.username,
      userEmail: user.email,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info." });
  }
};

module.exports = { signup, signin, getUserInfo };
