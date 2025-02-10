# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from app.routes.classify import router as classify_router
from app.routes.health import router as health_router  # Import new health routes
from app.routes.food_recommendation import router as food_recommendation_router  # Import new food recommendation routes
from app.routes.food_alternates import router as food_alternates_router  # Import new route for food alternatives
import google.generativeai as genai
# from app.routes.chat_route import router as chat_router

app = FastAPI(
    title="Waste Classification and Health API",
    description="An API to classify waste and provide health-related recommendations.",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    # allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include both routers
app.include_router(classify_router)  # Include waste classification routes
app.include_router(health_router)    # Include health-related routes
app.include_router(food_recommendation_router)  # Include food recommendation routes
app.include_router(food_alternates_router)  # Include the new food alternatives router
# app.include_router(chat_router)

# Root endpoint (handles GET /)
@app.get("/")
def read_root():
    return {"message": "Welcome to the Waste Classification and Health API!"}

# Favicon endpoint (handles GET /favicon.ico)
@app.get("/favicon.ico")
async def favicon():
    # If you have a favicon.ico file, serve it like this:
    favicon_path = "static/favicon.ico"  # Adjust this path if your favicon is elsewhere
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    
    # If no favicon.ico exists, return a blank response (or you can serve a default image)
    return FileResponse("static/blank.ico")  # You can also create a blank.ico file if preferred
