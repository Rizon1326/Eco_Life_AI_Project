# app/routes/food_alternates.py
from fastapi import APIRouter, HTTPException
from app.services.alternate_food import analyze_multiple_foods  # Import the service
from app.models.food_alternatives_models import FoodAlternativesResponse
from typing import List
from pydantic import BaseModel

# Create a model to handle the input request body
class FoodListRequest(BaseModel):
    food_list: List[str]  # List of food items

router = APIRouter(
    prefix="/food-alternatives",
    tags=["Food Alternatives"]
)

@router.post("/")
async def food_alternatives(request: FoodListRequest):
    """
    Get nutritional alternatives for a list of foods.
    """
    try:
        # Use the food_list from the request body
        results = analyze_multiple_foods(request.food_list)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
