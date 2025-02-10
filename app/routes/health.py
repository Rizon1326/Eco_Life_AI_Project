# app/routes/health.py
from fastapi import APIRouter
from app.models.health_models import HealthRequest  # Import the health model
from app.services.health_service import full_health_summary  # Import health service

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.post("/health_summary")
def health_summary(data: HealthRequest):
    # Call the service to calculate health summary
    return full_health_summary(data)
