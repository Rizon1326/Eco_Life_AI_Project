import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// API calls for different routes

export const classifyWaste = (formData) => {
  return api.post("/classify", formData);
};

export const getFoodAlternatives = (foodList) => {
  return api.post("/food-alternatives", { food_list: foodList });
};

export const getFoodRecommendation = (data) => {
  return api.post("/food-recommendation", data);
};

export const getHealthSummary = (data) => {
  return api.post("/health/health_summary", data);
};
