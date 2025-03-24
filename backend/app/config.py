from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OBD_PORT: str = "COM4"  # Updated to use the paired port
    OBD_BAUDRATE: int = 38400
    DEBUG_MODE: bool = True  # Keep debug mode on for better logging
    SIMULATION_MODE: bool = False  # Disable simulation mode for real OBD testing
    FAST_MODE: bool = False  # ELM327 specific setting
    TIMEOUT: int = 30  # General timeout for operations
    CONNECTION_RETRIES: int = 3  # Number of connection attempts
    COMMAND_RETRIES: int = 3  # Number of command retries
    MONITORING_INTERVAL: float = 0.5  # Seconds between updates
    MONITOR_CONTINUOUSLY: bool = True  # Enable continuous monitoring
    SCAN_ALL_PIDS: bool = True  # Enable scanning all supported PIDs
    GROQ_API_KEY_INSIGHTS: str
    GROQ_API_KEY_DIAGNOSTICS: str
    GROQ_API_KEY_CHAT: str

    class Config:
        env_file = ".env"

settings = Settings()
