# app/routes/food_recommendation.py
from fastapi import APIRouter
from app.models.food_recommendation_models import FoodRecommendationRequest  # Import the food recommendation model
from app.services.food_recommendation_service import get_food_recommendations  # Import the service

router = APIRouter(
    prefix="/food-recommendation",
    tags=["Food Recommendations"]
)


@router.post("/")
async def recommend_food(data: FoodRecommendationRequest):
    # Construct a query for Groq based on the user's diseases, BMI, and specific food
    query = f"Suggest optimal food choices for a person with the following disease(s): {data.diseases}. For each food, please: 1. Recommend the appropriate portion size to support health for this condition. 2. Explain how the food benefits the body, especially in relation to the listed diseases. 3. Provide detailed nutritional values for each food item. Finally, suggest a daily or weekly routine for the intake of these foods to ensure consistent health benefits while preventing the progression of the condition. Please make sure the recommendations are: - Smart and precise with nutritional values included. - Separate food recommendations from dietary restrictions and routines. - Responses should be clear, concise, and to the point, avoiding table formatting and in short."
    if data.specific_food:
        query += f""" Include recommendations for {data.specific_food} consumption:
               1. Ideal portion size per meal and recommended daily intake.
               2. Suggested weekly intake for balanced health.
               3. How {data.specific_food} benefits overall health considering the disease(s) and BMI.
               4. Any adjustments or restrictions based on health condition.
               5. Responses should be to the point and a little bit short.
               6. Sections should not be in tabular format."""
        
    # Get food recommendations from the service
    food_recommendations = get_food_recommendations(query)
    
    return food_recommendations
