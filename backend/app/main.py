from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .services.obd_service import OBDService
from .schemas.obd_data import OBDResponse
from pydantic import BaseModel
from app.config import settings


app = FastAPI(title="VigiCar OBD API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

obd_service = OBDService()

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
    data = obd_service.get_all_data()
    if not data:
        raise HTTPException(status_code=500, detail="Failed to fetch OBD data")
    return data

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
