# app/models/food_alternatives_models.py
from pydantic import BaseModel
from typing import List, Optional

class NutrientAlternative(BaseModel):
    name: str
    amount_grams: float
    cost_ratio: float
    key_matching_nutrients: List[str]

class FoodAlternativesResponse(BaseModel):
    original_food: dict
    alternatives: List[NutrientAlternative]
