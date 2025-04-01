import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .services.obd_service import OBDService
from .schemas.obd_data import OBDResponse
from pydantic import BaseModel
from app.config import settings
from app.services.ai_service import ask_groq_ai, generate_ai_insights, generate_ai_diagnostics
from typing import Dict, Any
import traceback

app = FastAPI(title="VigiCar OBD API")

# Validate API keys on startup
try:
    settings.validate_api_keys()
except ValueError as e:
    print(f"Configuration Error: {str(e)}")
    import sys
    sys.exit(1)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

obd_service = OBDService()

class AIChatRequest(BaseModel):
    user_query: str

class AIInsightsRequest(BaseModel):
    obd_data: Dict[str, Any]

class AIDiagnosticsRequest(BaseModel):
    obd_data: Dict[str, Any]

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.get("/connect")
async def connect_obd():
    success, message = obd_service.connect()
    if not success:
        raise HTTPException(status_code=500, detail=message)
    return {"status": "connected", "message": message}

@app.get("/data", response_model=OBDResponse)
async def get_obd_data():
    try:
        data = obd_service.get_all_data()
        if not data:
            error_details = "No data received from OBD service"
            if settings.DEBUG_MODE:
                print(f"Error: {error_details}")
            raise HTTPException(
                status_code=500, 
                detail=error_details
            )
        return data
    except Exception as e:
        error_details = f"Failed to fetch OBD data: {str(e)}"
        if settings.DEBUG_MODE:
            print(f"Error: {error_details}")
            print("Traceback:", traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=error_details
        )

class AccelerationParams(BaseModel):
    target_speed: float
    duration: float = 5.0

@app.get("/supported")
async def get_supported_commands():
    commands = obd_service.get_supported_commands()
    return commands

@app.post("/simulate/accelerate")
async def simulate_acceleration(params: AccelerationParams):
    if not obd_service.simulation_mode:
        if settings.DEBUG_MODE:
            print("Simulation rejected: Simulation mode is disabled")
        raise HTTPException(
            status_code=400, 
            detail=f"Simulation mode is not enabled. Please set SIMULATION_MODE=True in config"
        )
    success = obd_service.simulate_acceleration(params.target_speed, params.duration)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to start acceleration simulation")
    return {"status": "simulation started", "target_speed": params.target_speed}

from app.services.ai_service import ask_groq_ai, generate_ai_insights, generate_ai_diagnostics

@app.post("/ai/chat")
async def ai_chat(request: AIChatRequest):
    # Fetch real-time OBD data
    obd_data = obd_service.get_all_data()
    if not obd_data:
        raise HTTPException(status_code=500, detail="Failed to fetch OBD data")

    # Call the AI service with the user's query and OBD data
    response = ask_groq_ai(request.user_query, obd_data)
    return {"response": response}

@app.post("/ai/insights")
async def ai_insights():
    # Fetch real-time OBD data
    obd_data = obd_service.get_all_data()
    if not obd_data:
        raise HTTPException(status_code=500, detail="Failed to fetch OBD data")

    # Generate insights using the real-time OBD data
    response = generate_ai_insights(obd_data)
    return response

@app.post("/ai/diagnostics")
async def ai_diagnostics():
    try:
        # Fetch real-time OBD data
        obd_data = obd_service.get_all_data()
        if not obd_data:
            raise HTTPException(status_code=500, detail="Failed to fetch OBD data")

        # Generate diagnostics using the real-time OBD data
        response = generate_ai_diagnostics(obd_data)
        return response
    except Exception as e:
        # Log the error for debugging
        logging.error(f"Error in /ai/diagnostics: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")