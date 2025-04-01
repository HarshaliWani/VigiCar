import requests
from app.config import settings
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

GROQ_API_KEY_INSIGHTS = settings.GROQ_API_KEY_INSIGHTS
GROQ_API_KEY_DIAGNOSTICS = settings.GROQ_API_KEY_DIAGNOSTICS
GROQ_API_KEY_CHAT = settings.GROQ_API_KEY_CHAT

def calculate_driving_score(obd_data: Dict[str, Any]) -> int:
    speed = obd_data.get("speed", 0)
    rpm = obd_data.get("rpm", 0)
    throttle = obd_data.get("throttle_position", 0)
    engine_load = obd_data.get("engine_load", 0)

    score = 100

    # Speed penalty (Linear reduction from 100 km/h to 150 km/h)
    if speed > 100:
        score -= min((speed - 100) * 2, 50)  # Max penalty is 50

    # RPM penalty (Linear reduction from 4000 to 7000 RPM)
    if rpm > 4000:
        score -= min((rpm - 4000) / 30, 30)  # Max penalty is 30

    # Throttle penalty (Aggressive acceleration reduces score)
    if throttle > 60:
        score -= min((throttle - 60) / 2, 20)  # Max penalty is 20

    # Engine load penalty (Over 80% starts affecting the score)
    if engine_load > 80:
        score -= min((engine_load - 80) / 2, 10)  # Max penalty is 10

    return int(max(score, 0))


def calculate_eco_score(obd_data: Dict[str, Any]) -> int:
    fuel_rate = obd_data.get("fuel_rate", 0)
    throttle = obd_data.get("throttle_position", 0)
    engine_load = obd_data.get("engine_load", 0)
    rpm = obd_data.get("rpm", 0)

    score = 100  
    # Fuel rate penalty (Linear reduction from 5 L/h to 15 L/h)
    if fuel_rate > 5:
        score -= min((fuel_rate - 5) * 5, 30)  # Max penalty is 30
    # Throttle penalty (Higher throttle means less eco-friendly)
    if throttle > 50:
        score -= min((throttle - 50) / 2, 20)  # Max penalty is 20
    # Engine load penalty (Higher engine load reduces eco score)
    if engine_load > 70:
        score -= min((engine_load - 70) / 2, 20)  # Max penalty is 20
    # High RPM penalty (4000+ RPM reduces eco score)
    if rpm > 4000:
        score -= min((rpm - 4000) / 30, 30)  # Max penalty is 30
    return int(max(score, 0))

def calculate_safety_score(obd_data: Dict[str, Any]) -> int:
    speed = obd_data.get("speed", 0)
    throttle = obd_data.get("throttle_position", 0)
    coolant_temp = obd_data.get("coolant_temp", 90)

    score = 100  
    # Speed penalty (Linear reduction from 80 to 140 km/h)
    if speed > 80:
        score -= min((speed - 80) * 2, 50)  # Max penalty is 50
    # Throttle penalty (Over 70% throttle reduces safety)
    if throttle > 70:
        score -= min((throttle - 70) / 2, 20)  # Max penalty is 20
    # High coolant temp penalty (Over 100°C is risky)
    if coolant_temp > 100:
        score -= min((coolant_temp - 100) * 2, 30)  # Max penalty is 30
    return int(max(score, 0))

def calculate_engine_health(obd_data: Dict[str, Any]) -> int:
    """
    Calculate engine health based on RPM, engine load, coolant temperature, and throttle position.
    Returns a score between 0 and 100, where 100 indicates excellent engine health.
    """
    rpm = obd_data.get("rpm", 0)
    engine_load = obd_data.get("engine_load", 0)
    coolant_temp = obd_data.get("coolant_temp", 90)  # Default to normal operating temperature
    throttle_position = obd_data.get("throttle_position", 0)

    # Start with a perfect score
    health_score = 100

    # RPM penalty (Optimal range: 800 to 4000 RPM)
    if rpm > 4000:
        health_score -= min((rpm - 4000) / 50, 20)  # Max penalty is 20
    elif rpm < 800:
        health_score -= 10  # Penalty for idle or low RPM

    # Engine load penalty (Optimal range: 20% to 80%)
    if engine_load > 80:
        health_score -= min((engine_load - 80) / 2, 15)  # Max penalty is 15
    elif engine_load < 20:
        health_score -= 5  # Penalty for low engine load

    # Coolant temperature penalty (Optimal range: 70°C to 100°C)
    if coolant_temp > 100:
        health_score -= min((coolant_temp - 100) * 2, 20)  # Max penalty is 20
    elif coolant_temp < 70:
        health_score -= 10  # Penalty for low coolant temperature

    # Throttle position penalty (Optimal range: 10% to 60%)
    if throttle_position > 60:
        health_score -= min((throttle_position - 60) / 2, 10)  # Max penalty is 10
    elif throttle_position < 10:
        health_score -= 5  # Penalty for low throttle usage

    # Ensure the score is within the range of 0 to 100
    return int(max(0, min(health_score, 100)))

def ask_groq_ai(user_query: str, obd_data: Dict[str, Any]) -> str:
    prompt = f"""
    You are an AI assistant for a car owner. The user is asking: "{user_query}"

    Here is the car's latest OBD data:
    - Speed: {obd_data.get("speed", "N/A")} km/h  
    - RPM: {obd_data.get("rpm", "N/A")}  
    - Throttle Position: {obd_data.get("throttle_position", "N/A")}%  
    - Engine Load: {obd_data.get("engine_load", "N/A")}%  
    - Coolant Temperature: {obd_data.get("coolant_temp", "N/A")}°C  
    - Intake Air Temperature: {obd_data.get("intake_temp", "N/A")}°C  
    - Fuel Level: {obd_data.get("fuel_level", "N/A")}%  
    - Timing Advance: {obd_data.get("timing_advance", "N/A")}°  
    - Mass Air Flow (MAF): {obd_data.get("maf", "N/A")} g/s  
    - O2 Sensor Voltage (Bank 1, Sensor 1): {obd_data.get("o2_voltage", "N/A")} V
    
    Based on this data, provide an answer to the user's question. Only answer the user query and explain the relevance. The data provided should be used to generate the response.
    """

    if not GROQ_API_KEY_CHAT:
        return "Error: AI API key is missing."

    headers = {"Authorization": f"Bearer {GROQ_API_KEY_CHAT}", "Content-Type": "application/json"}
    payload = {"model": "deepseek-r1-distill-llama-70b", "messages": [{"role": "user", "content": prompt}]}

    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        ai_response = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

        # Log the raw AI response
        logging.info(f"Raw AI Response: {ai_response}")

        # Extract the actual response content (exclude the <think> part)
        try:
            start_index = ai_response.find("<think>")
            end_index = ai_response.find("</think>") + len("</think>")
            if start_index != -1 and end_index != -1:
                ai_response = ai_response[end_index:].strip()  # Remove the <think> part
            return ai_response
        except Exception as e:
            logging.error(f"Error parsing AI response: {str(e)}")
            return "Sorry, I couldn't process your request."

    except requests.RequestException as e:
        logging.error(f"Error in AI response: {str(e)}")
        return f"Error in AI response: {str(e)}"
    
    
def generate_ai_insights(obd_data: Dict[str, Any]) -> Dict[str, Any]:
    # Analyze OBD data
    driving_score = calculate_driving_score(obd_data)
    eco_score = calculate_eco_score(obd_data)
    safety_score = calculate_safety_score(obd_data)
    engine_health = calculate_engine_health(obd_data)

    prompt = f"""
    You are an AI assistant analyzing a car's performance. The user's latest OBD data:
    - Speed: {obd_data.get("speed", "N/A")} km/h
    - RPM: {obd_data.get("rpm", "N/A")}  
    - Throttle Position: {obd_data.get("throttle_position", "N/A")}%  
    - Engine Load: {obd_data.get("engine_load", "N/A")}%  
    - Fuel Level: {obd_data.get("fuel_level", "N/A")}%  
    - Coolant Temperature: {obd_data.get("coolant_temp", "N/A")}°C  

    Based on this data, provide a list of driving tips, which will include, fuel-efficient driving, how to improve engine performance and Safety recommendations for better driving habits. Explain the relevance of the data values in your tips and provide atleast 3 tips and maximum 5 tips in the following JSON format:
    {{
        "driving_tips": [
            {{
                "tip": "Brief description of the driving tip",
                "details": "Detailed explanation of the tip"
            }}
        ]
    }}
    """

    headers = {"Authorization": f"Bearer {GROQ_API_KEY_INSIGHTS}", "Content-Type": "application/json"}
    payload = {"model": "deepseek-r1-distill-llama-70b", "messages": [{"role": "user", "content": prompt}]}

    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        ai_response = response.json()["choices"][0]["message"]["content"]

        # Log the raw AI response
        logging.info(f"AI Response: {ai_response}")

        # Safely parse the AI response to extract driving tips
        try:
            # Extract the JSON part of the response
            start_index = ai_response.find("{")
            end_index = ai_response.rfind("}") + 1
            json_part = ai_response[start_index:end_index]

            # Parse the JSON part
            parsed_response = json.loads(json_part)
            driving_tips = parsed_response.get("driving_tips", [])
        except (json.JSONDecodeError, ValueError, AttributeError) as e:
            logging.error(f"Error parsing AI response: {str(e)}")
            driving_tips = []

    except (requests.RequestException, KeyError) as e:
        logging.error(f"Error while fetching AI response: {str(e)}")
        driving_tips = []

    # Return all metrics
    return {
        "driving_score": driving_score,
        "eco_score": eco_score,
        "safety_score": safety_score,
        "engine_health": engine_health,
        "driving_tips": driving_tips
    }


import json  # Import the JSON module for safe parsing

def generate_ai_diagnostics(obd_data: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""
    You are an AI assistant analyzing a car's performance. The user's latest OBD data:
    - Speed: {obd_data.get("speed", "N/A")} km/h
    - RPM: {obd_data.get("rpm", "N/A")}  
    - Throttle Position: {obd_data.get("throttle_position", "N/A")}%  
    - Engine Load: {obd_data.get("engine_load", "N/A")}%  
    - Fuel Level: {obd_data.get("fuel_level", "N/A")}%  
    - Coolant Temperature: {obd_data.get("coolant_temp", "N/A")}°C  

    Provide insights and warnings in JSON format:
    {{
        "insights": [
            {{
                "title": "Insight Title",
                "description": "Detailed explanation of the insight"
            }}
        ],
        "warnings": [
            {{
                "title": "Warning Title",
                "description": "Detailed explanation of the warning"
            }}
        ]
    }}
    """

    headers = {"Authorization": f"Bearer {GROQ_API_KEY_DIAGNOSTICS}", "Content-Type": "application/json"}
    payload = {"model": "deepseek-r1-distill-llama-70b", "messages": [{"role": "user", "content": prompt}]}

    # Log the payload for debugging
    logging.info(f"Diagnostics Payload: {payload}")

    try:
        # Send the request to the AI API
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        ai_response = response.json().get("choices", [{}])[0].get("message", {}).get("content", "{}")

        # Log the raw AI response
        logging.info(f"Raw AI Response: {ai_response}")

        # Safely parse the AI response to extract insights and warnings
        try:
            # Extract the JSON part of the response
            start_index = ai_response.find("{")
            end_index = ai_response.rfind("}") + 1
            json_part = ai_response[start_index:end_index]

            # Parse the JSON part
            parsed_response = json.loads(json_part)
            insights = parsed_response.get("insights", [])
            warnings = parsed_response.get("warnings", [])
        except (json.JSONDecodeError, ValueError, AttributeError) as e:
            logging.error(f"Error parsing AI response: {str(e)}")
            insights = []
            warnings = []

    except (requests.RequestException, KeyError) as e:
        logging.error(f"Error while fetching AI response: {str(e)}")
        insights = []
        warnings = []

    # Ensure the response is always in the correct format
    return {
        "insights": insights,
        "warnings": warnings
    }