//controllers/chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API with API key
const genAI = new GoogleGenerativeAI("AIzaSyDJaIv8Ed5RDrDGsAl36-EGmAp4gjpUTx8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatbotResponse = async (req, res) => {
    try {
        const { age, gender, height, weight, activityLevel, healthGoals, medicalConditions, foodPreferences } = req.body;

        // Validate required fields
        if (!age || !gender || !height || !weight) {
            return res.status(400).json({ message: "Age, gender, height, and weight are required." });
        }

        // Ensure optional fields are arrays or handle them properly
        const formattedHealthGoals =
            Array.isArray(healthGoals) ? healthGoals.join(", ") : healthGoals || "Not provided";
        const formattedMedicalConditions =
            Array.isArray(medicalConditions) ? medicalConditions.join(", ") : medicalConditions || "None";
        const formattedFoodPreferences =
            Array.isArray(foodPreferences) ? foodPreferences.join(", ") : foodPreferences || "No restrictions";

        // Prepare prompt for Gemini API
        const prompt = `
        The user is asking for health recommendations based on their body information:
        - Age: ${age}
        - Gender: ${gender}
        - Height: ${height} cm
        - Weight: ${weight} kg
        - Activity Level: ${activityLevel || "Not provided"}
        - Health Goals: ${formattedHealthGoals}
        - Medical Conditions: ${formattedMedicalConditions}
        - Food Preferences: ${formattedFoodPreferences}

        Provide user-friendly health advice, focusing on actionable tips like:
        1. General health suggestions.
        2. Dietary recommendations (based on food preferences).
        3. Fitness or activity advice.
        4. Any necessary medical considerations.

        Include the value of BMI and BMR.Keep it motivational and easy to follow. 
        `;

        // Send prompt to Gemini API
        const result = await model.generateContent(prompt);

        // Extract and send response back to user
        res.status(200).json({
            message: "Response from Gemini API",
            data: result.response.text(), // Gemini API response
        });
    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.status(500).json({
            message: "Something went wrong with Gemini API.",
            error: error.message,
        });
    }
};

module.exports = {
    chatbotResponse,
};
