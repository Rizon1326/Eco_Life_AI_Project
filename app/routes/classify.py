from fastapi import APIRouter, UploadFile, HTTPException
from app.services.classify_service import classify_image  # Keep this import

router = APIRouter(
    prefix="/classify",  # Prefix for all routes in this file
    tags=["Classification"]  # Tags for documentation in Swagger UI
)

@router.post("/")
async def classify_waste(file: UploadFile):
    # Check if the uploaded file is an image (PNG, JPG, JPEG)
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="File must be an image (PNG, JPG, JPEG)")
    
    # Classify the waste based on the uploaded image
    waste_type, details = classify_image(file)
    
    # Return a response containing the filename, waste type, and details
    return {
        "filename": file.filename,
        "waste_type": waste_type,
        "details": details
    }
