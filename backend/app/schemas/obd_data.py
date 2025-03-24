from pydantic import BaseModel
from typing import Optional

class OBDResponse(BaseModel):
    speed: Optional[float] = None
    rpm: Optional[float] = None
    throttle_position: Optional[float] = None
    engine_load: Optional[float] = None
    coolant_temp: Optional[float] = None
    intake_temp: Optional[float] = None
    fuel_level: Optional[float] = None
    timing_advance: Optional[float] = None
    maf: Optional[float] = None
    o2_voltage: Optional[float] = None
    
    class Config:
        extra = 'allow'  # Allow extra fields in the response
