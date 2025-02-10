import os
import re
from typing import Optional
from app.models.health_models import HealthRequest
from groq import Groq

os.environ["GROQ_API_KEY"] = "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"

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def clean_response(response_content: str) -> str:
    response_content = re.sub(r'<think>.*?</think>', '', response_content, flags=re.DOTALL)
    response_content = response_content.replace("#", "").strip()
    response_content = re.sub(r'### (.*?)', r'<h3>\1</h3>', response_content)
    response_content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', response_content)
    response_content = re.sub(r'\* (.*?)(\n|$)', r'<li>\1</li>', response_content)
    response_content = re.sub(r'(\n<li>.*?</li>)+', r'<ul>\g<0></ul>', response_content)
    return response_content

def get_groq_response(query: str) -> dict:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": query}],
        model="deepseek-r1-distill-llama-70b",
    )
    response_content = chat_completion.choices[0].message.content
    cleaned_response = clean_response(response_content)
    structured_response = {
        "food_suggestions": parse_suggestions(cleaned_response),
        "recommendations": parse_recommendations(cleaned_response),
        "alerts": parse_alerts(cleaned_response),
        "additional_notes": extract_additional_info(cleaned_response)
    }
    return structured_response

def parse_suggestions(response_content: str) -> list:
    suggestions = []
    if "suggest" in response_content.lower():
        suggestions = response_content.split('\n')
    suggestions = [suggestion.strip().replace("#", "") for suggestion in suggestions if suggestion.strip()]
    return suggestions

def parse_recommendations(response_content: str) -> list:
    recommendations = []
    if "recommend" in response_content.lower():
        recommendations = response_content.split('\n')
    recommendations = [recommendation.strip() for recommendation in recommendations if recommendation.strip()]
    return recommendations

def parse_alerts(response_content: str) -> list:
    alerts = []
    if "alert" in response_content.lower():
        alerts = response_content.split('\n')
    alerts = [alert.strip() for alert in alerts if alert.strip()]
    return alerts

def extract_additional_info(response_content: str) -> str:
    return "Consult with your healthcare provider for personalized dietary recommendations."

def calculate_bmi(weight: float, height: float) -> tuple:
    height_m = height / 100
    bmi = weight / (height_m ** 2)
    bmi_category = ""

    if bmi < 18.5:
        bmi_category = "Underweight"
    elif 18.5 <= bmi <= 24.9:
        bmi_category = "Normal weight"
    elif 25 <= bmi <= 29.9:
        bmi_category = "Overweight"
    else:
        bmi_category = "Obesity"

    return round(bmi, 2), bmi_category  # Returning both BMI and its category


def calculate_energy_loss(age: int, weight: float, height: float, gender: str, pregnancy: Optional[bool], period: Optional[bool], activity_level: str) -> float:
    if gender == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    if activity_level.lower() == "sedentary":
        bmr *= 1.2
    elif activity_level.lower() == "moderate":
        bmr *= 1.55
    elif activity_level.lower() == "active":
        bmr *= 1.75
    if pregnancy:
        bmr += 300
    if period:
        bmr += 100
    return bmr

def recommend_calories(data: HealthRequest) -> float:
    energy_loss = calculate_energy_loss(data.age, data.weight, data.height, data.gender, data.pregnancy, data.period, data.daily_activities)
    return energy_loss

def suggest_food(diseases: Optional[str], bmi: float) -> str:
    query = f"""Suggest appropriate foods for someone with the following condition(s): {diseases}. Also, provide food restrictions based on the condition(s) and a BMI of {bmi}.Ensure the response is concise and systematic, with short, sharp sentences. Present the food recommendations in a neat and clear with nutrition details and portion sizes. """
    response = get_groq_response(query)
    return response

def food_restrictions(diseases: Optional[str]) -> str:
    if diseases:
        query = f"Provide food restrictions for someone with the following disease(s): {diseases}. Just give me the food and their reasons . And every reason contains a short sentence. The sentences should be more smarter and short." 
        response = get_groq_response(query)
        return response['alerts']
    return "No food restrictions based on provided diseases."

def full_health_summary(data: HealthRequest):
    bmi, bmi_category = calculate_bmi(data.weight, data.height)  # Getting BMI and its category
    calories = recommend_calories(data)
    food_suggestion = suggest_food(data.diseases, bmi)
    restrictions = food_restrictions(data.diseases)
    
    return {
        "bmi": bmi,
        "bmi_category": bmi_category,  # Adding BMI category to the response
        "recommended_calories": calories,
        "food_suggestions": format_list(food_suggestion["food_suggestions"]),
        "recommendations": format_list(food_suggestion["recommendations"]),
        "alerts": format_list(food_suggestion["alerts"]),
        "food_restrictions": format_list(restrictions),
        "additional_notes": food_suggestion["additional_notes"]
    }


def format_list(items):
    return [item.strip() for item in items if item.strip()]
