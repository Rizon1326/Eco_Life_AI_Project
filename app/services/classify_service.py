import os
from transformers import pipeline
from app.utils.file_handler import save_temp_image
from PIL import Image
import google.generativeai as genai
from tensorflow.keras.models import load_model
import threading
# Initialize the Hugging Face model
classifier = pipeline("image-classification", model="microsoft/swin-tiny-patch4-window7-224")

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCRJWPgakOG1RMCU7m9Q3UvnRuhBn9LyCA" 
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# model_path = os.path.join('EcoLife-AI-Project/app/models/keras_model3.h5')
# keras_model = load_model(model_path)
####
# keras_model = load_model('EcoLife-AI-Project/app/models/keras_model3.h5')
###
# Function to load the model in a separate thread
def load_keras_model_in_background():
    model_path = os.path.join('EcoLife-AI-Project/app/models/keras_model3.h5')
    keras_model = load_model(model_path)
    print("Model loaded successfully!")

# Create a new thread for loading the model
model_loading_thread = threading.Thread(target=load_keras_model_in_background)

# Start the thread
# model_loading_thread.start()
def get_waste_type(label: str) -> str:
    """Map the model's label to specific waste type using Gemini"""
    prompt = f"""
    Based on the image classification label '{label}', identify the exact waste material type.
    Consider common materials like:
    - "Plastic" if '{label}' contains words like (Plastic Bottle, Plastic Bag, Plastic Container, etc.)
    - "Paper/Cardboard" if '{label}' contains words like (Cardboard Boxes, Paper Bags, Newspaper, etc.)
    - "Metal" if '{label}' contains words like (Drink Cans, Aluminum Bottles, Tin Foil, etc.)
    - "Glass" if '{label}' contains words like (Glass Bottles, Glass Jars, Glass Containers, etc.)
    - "Organic Waste" if '{label}' contains words like (Fruit peels, Coffee grounds, Eggshells, etc.)
    - "Electronic waste" if '{label}' contains words like (Old Computers, Broken Monitors, Mobile Phones, etc.)
    - "Medical waste" if '{label}' contains words like (Syringe, Needle, Glove, Scalpel, etc.)
    - "Battery" if '{label}' contains words like (Pencil Battery, Button Cell Battery, AA Battery, etc.)
    - "Wood Waste" if '{label}' contains words like (Wooden Furniture, Wooden Pallets, Wooden Boards, etc.)
    - "Textile Waste" if '{label}' contains words like (Clothing, Shoes, Fabric, Upholstery, etc.)
    - "Rubber Waste" if '{label}' contains words like (Tires, Rubber Bands, Rubber Gloves, etc.)
    - "Construction and Demolition Waste" if '{label}' contains words like (Concrete, Bricks, Tiles, Cement Bags, etc.)
    - "Agricultural Waste" if '{label}' contains words like (Crop Residue, Pesticides, Fertilizers, Plant Trimmings, etc.)

    Return ONLY the specific waste material type in a single line, no explanation.
    Example outputs:
    "PET Plastic"
    "Corrugated Cardboard"
    "Aluminum Can"
    """
    
    try:
        response = model.generate_content(prompt)
        waste_type = response.text.strip()
        return waste_type
    except Exception as e:
        return f"Unidentified Waste: {str(e)}"

def get_gemini_response(waste_type: str) -> str:
    """Get detailed information about waste disposal from Gemini"""
    prompt = f"""
    Based on the identified waste type '{waste_type}', provide a concise waste management response covering:
    1. Relevant SDG goal
    2. Specific material properties
    3. Environmental impact (soil, water, air)
    4. Harm to humans and animals
    5. Best disposal or recycling methods
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Unable to generate detailed analysis: {str(e)}"

def process_classification_results(label: str, score: float) -> dict:
    """Process the model's classification label into detailed waste information"""
    # Get specific waste type using Gemini
    specific_waste_type = get_waste_type(label)
    
    return {
        "type": specific_waste_type,  # Use the specific waste type identified by Gemini
        "original_label": label,  # Keep the original classification for reference
        "confidence_score": score,
        "description": f"Identified waste type: {specific_waste_type} (based on {label})",
        "recyclable": None,  # This will be determined by Gemini's analysis
    }

def classify_image(uploaded_file):
    """Classify waste from an uploaded image with specific material identification"""
    try:
        # Save and load the image
        image_path = save_temp_image(uploaded_file)
        image = Image.open(image_path)
        
        # Get classification results from the Swin Transformer model
        results = classifier(image)
        
        # Store all classification details
        all_predictions = [{"label": r["label"], "score": r["score"]} for r in results]
        
        # Process the top prediction (highest confidence score)
        if results and results[0]["score"] >= 0.10:  # Minimum confidence threshold
            top_prediction = results[0]
            
            # Process the classification result with specific waste type identification
            waste_details = process_classification_results(
                top_prediction["label"],
                top_prediction["score"]
            )
            
            # Get detailed analysis using the specific waste type
            gemini_insights = get_gemini_response(waste_details["type"])
            waste_details["waste_analysis"] = gemini_insights
            
        else:
            waste_details = {
                "type": "Unidentified",
                "original_label": None,
                "confidence_score": 0,
                "description": "Could not confidently classify the image.",
                "recyclable": None,
                "waste_analysis": "Unable to provide detailed analysis due to low confidence classification."
            }
        
        # Cleanup temporary files
        cleanup_temp_files(image_path)
        
        return waste_details, all_predictions
        
    except Exception as e:
        error_response = {
            "type": "Error",
            "original_label": None,
            "confidence_score": 0,
            "description": f"Error during classification: {str(e)}",
            "recyclable": None,
            "waste_analysis": "An error occurred during the analysis process."
        }
        return error_response, []

def cleanup_temp_files(image_path):
    """Clean up temporary files after processing"""
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
    except Exception as e:
        print(f"Error cleaning up temporary files: {str(e)}")