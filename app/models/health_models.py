# app/models/health_models.py
from pydantic import BaseModel
from typing import Optional

class HealthRequest(BaseModel):
    height: float  # in cm
    weight: float  # in kg
    age: int
    gender: str  # 'male' or 'female'
    blood_pressure: Optional[str]  # Optional as it might not always be provided
    diseases: Optional[str]  # Optional diseases information
    daily_activities: str  # Activities description
    pregnancy: Optional[bool] = None  # Only relevant for females
    period: Optional[bool] = None  # Only relevant for females