# app/services/chatbot_service.py
from google.generativeai import genai
from pydantic import BaseModel
import os

# Set up your Google API Key for Gemini
os.environ["GOOGLE_API_KEY"] = "AIzaSyDJaIv8Ed5RDrDGsAl36-EGmAp4gjpUTx8"

# Set up the model configuration for generative AI (using Gemini)
def setup_gemini():
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-1.5-flash')  # Ensure this matches the actual model name you want to use
    return model

async def chat_with_bot(message: str) -> str:
    model = setup_gemini()

    try:
        # Generate the response from the model
        response = model.generate_content(f"তুমি একজন সাহায্যকারী সহকারী। নিচের বার্তাটি অনুসরণ করো: {message}")
        return response.text.strip()

    except Exception as e:
        print(f"Error in chatbot service: {str(e)}")
        return "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"

