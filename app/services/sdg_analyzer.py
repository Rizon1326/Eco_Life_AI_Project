# app/services/sdg_analyzer.py
import requests

# Define the mapping of waste types to SDG goals
SDG_GOAL_MAPPING = {
    "Medical Waste": {
        "goal": "SDG 3: Good Health and Well-being",
        "guidance": "Dispose of safely to prevent the spread of diseases and infections."
    },
    "Plastic": {
        "goal": "SDG 12: Responsible Consumption and Production",
        "guidance": "Recycle or upcycle to reduce environmental impact. Avoid single-use plastics."
    },
    "Rubber": {
        "goal": "SDG 13: Climate Action",
        "guidance": "Reprocess or recycle rubber waste to prevent environmental harm and reduce CO2 emissions."
    },
    "E-Waste": {
        "goal": "SDG 9: Industry, Innovation, and Infrastructure",
        "guidance": "Recycle electronic waste through certified facilities to recover valuable materials and reduce toxic pollution."
    },
    "Organic Waste": {
        "goal": "SDG 2: Zero Hunger",
        "guidance": "Compost organic waste to create nutrient-rich soil, supporting sustainable agriculture and reducing landfill burden."
    },
    "Hazardous Chemicals": {
        "goal": "SDG 6: Clean Water and Sanitation",
        "guidance": "Ensure proper disposal of hazardous chemicals to prevent contamination of water sources and ecosystems."
    },
    "Glass": {
        "goal": "SDG 12: Responsible Consumption and Production",
        "guidance": "Recycle glass waste to reduce energy consumption and environmental harm. Reuse bottles and jars where possible."
    },
    "Metal": {
        "goal": "SDG 9: Industry, Innovation, and Infrastructure",
        "guidance": "Recycle metals to support sustainable infrastructure and reduce the environmental impact of mining."
    },
    "Paper": {
        "goal": "SDG 15: Life on Land",
        "guidance": "Recycle paper to reduce deforestation and support the conservation of terrestrial ecosystems."
    },
    "Batteries": {
        "goal": "SDG 12: Responsible Consumption and Production",
        "guidance": "Recycle batteries through certified programs to recover materials and avoid harmful heavy metal pollution."
    },
    "Textiles": {
        "goal": "SDG 12: Responsible Consumption and Production",
        "guidance": "Donate or recycle textiles to reduce landfill waste and promote sustainable fashion."
    },
    "Food Waste": {
        "goal": "SDG 2: Zero Hunger",
        "guidance": "Minimize food waste by redistributing edible food and composting inedible portions."
    },
    "Construction Debris": {
        "goal": "SDG 11: Sustainable Cities and Communities",
        "guidance": "Reuse and recycle construction materials to promote sustainable urban development."
    },
    "Oil and Lubricants": {
        "goal": "SDG 6: Clean Water and Sanitation",
        "guidance": "Safely dispose of used oil and lubricants to prevent contamination of water bodies."
    }
}


GROQ_API_KEY = "###xxx***"
GROQ_API_URL = "https://api.groq.com/analyze"  # Replace with actual Groq API URL


def analyze_waste(waste_type):
    # Get the SDG goal mapping
    sdg_info = SDG_GOAL_MAPPING.get(waste_type["type"], None)
    if not sdg_info:
        sdg_info = {
            "goal": "Unknown SDG Goal",
            "guidance": "No specific guidance available for this waste type.",
        }

    # Determine recyclability and provide disposal guidance
    if waste_type.get("recyclable"):
        disposal_guidance = f"You can recycle this waste. {waste_type.get('description', '')} Consider reusing or upcycling where possible."
    else:
        disposal_guidance = f"This waste is non-recyclable. {waste_type.get('description', '')} Ensure safe disposal to minimize harm."

    # Query the Groq API for additional insights using type instead of label
    groq_response = query_groq_api(waste_type["type"])
    groq_insights = groq_response.get("insights", "No additional insights available.")

    return {
        "sdg_goal": sdg_info["goal"],
        "guidance": sdg_info["guidance"],
        "recyclable": waste_type.get("recyclable"),
        "disposal_guidance": disposal_guidance,
        "groq_insights": groq_insights,
    }

def query_groq_api(label):
    try:
        response = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"label": label},
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Groq API returned status {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
