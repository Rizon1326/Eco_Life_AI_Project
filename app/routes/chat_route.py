# app/routes/chat_route.py
from fastapi import APIRouter, HTTPException, Request
from app.services.chatbot_service import chat_with_bot
from pydantic import BaseModel

# Create an instance of APIRouter
router = APIRouter(
    prefix="/chat",
    tags=["Chat with AI"]
)

# Define the request model for input
class ChatRequest(BaseModel):
    message: str

@router.post("/message")
async def chat_with_user(req: ChatRequest):
    # Get the message from the user
    message = req.message
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Call the service to get a response from the chatbot
    response = await chat_with_bot(message)
    return {"reply": response}
