# app/services/alternate_food.py
import os
import google.generativeai as genai
import json
from app.models.food_alternatives_models import FoodAlternativesResponse
from typing import List

# Set your Gemini API Key
GEMINI_API_KEY = "AIzaSyCRJWPgakOG1RMCU7m9Q3UvnRuhBn9LyCA"  # Replace with your actual API key

# Setup function for Gemini API
def setup_gemini():
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    return model

# Function to get nutritional alternatives using the Gemini API
def get_nutrition_alternatives(food_item: str, amount_grams: int = 100) -> FoodAlternativesResponse:
    model = setup_gemini()
    prompt = f"""
    For {amount_grams}g of {food_item}, provide affordable alternative foods that give similar nutritional value.
    Consider local Bengali foods and ingredients.
    Return exactly in this JSON format (numbers should be numeric, not strings):
    {{
        "original_food": {{
            "name": "{food_item}",
            "amount": {amount_grams},
            "key_nutrients": ["list main nutrients"]
        }},
        "alternatives": [
            {{
                "name": "alternative food name",
                "amount_grams": 0,
                "cost_ratio": 0.0,
                "key_matching_nutrients": ["matching nutrients"]
            }}
        ]
    }}
    The cost_ratio should be a number between 0 and 1 representing how much cheaper the alternative is.
    Focus on locally available, affordable options in Bangladesh.
    """
    
    response = model.generate_content(prompt)
    
    # Debugging: Print the raw response text from Gemini
    print(f"Raw response from Gemini for {food_item}: {response.text.strip()}")  # Debug line

    try:
        # Clean the response text to ensure it only contains the JSON part
        response_text = response.text.strip()
        
        # If the response contains ` ```json ` or any extra characters, we remove them
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        
        # Check if the response text is empty or invalid
        if not response_text:
            raise ValueError(f"Empty response for {food_item}")
        
        # Parse the cleaned JSON response
        response_data = json.loads(response_text)
        
        # Convert the data into a structured FoodAlternativesResponse object
        return FoodAlternativesResponse(**response_data)
    
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON for {food_item}: {str(e)}")
        return {"error": "Failed to parse JSON response from Gemini"}
    except Exception as e:
        print(f"Error processing {food_item}: {str(e)}")
        return {"error": str(e)}

# Function to analyze multiple food items and create a response list
def analyze_multiple_foods(food_list: List[str]) -> List[FoodAlternativesResponse]:
    results = []
    
    for food in food_list:
        data = get_nutrition_alternatives(food)
        if "error" not in data:
            results.append(data)
        else:
            print(f"Error processing food: {food}")
    
    return results
