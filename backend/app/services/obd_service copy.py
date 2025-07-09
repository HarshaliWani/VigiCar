from typing import Dict, Optional, Any, Union, Tuple, List
import obd
import random
import time
import threading
from app.config import settings
import asyncio
from bleak import BleakScanner, BleakClient

class OBDService:
    connection: Optional[obd.OBD]
    simulation_mode: bool
    
    def __init__(self) -> None:
        self.connection = None
        self.simulation_mode = settings.SIMULATION_MODE
        self.supported_commands = []
        self.is_monitoring = False
        self.last_data = {}
        self.monitor_thread = None
        
    async def _scan_bluetooth_devices(self):
        """Scan for Bluetooth devices"""
        devices = await BleakScanner.discover(timeout=settings.BT_SCAN_TIMEOUT)
        return {str(device.address): device.name for device in devices}

    def connect(self) -> Tuple[bool, str]:
        if self.simulation_mode:
            return True, "Connected successfully (Simulation Mode)"
            
        try:
            if settings.DEBUG_MODE:
                if settings.CONNECTION_TYPE == "BT":
                    print(f"Attempting to connect to ELM327 via Bluetooth: {settings.BT_MAC_ADDRESS}")
                else:
                    print(f"Attempting to connect to ELM327 emulator on port {settings.OBD_PORT}")
                    ports = obd.scan_serial()
                    print(f"Available ports: {ports}")
            
            obd.logger.setLevel(obd.logging.DEBUG)
            
            for attempt in range(settings.CONNECTION_RETRIES):
                try:
                    if settings.CONNECTION_TYPE == "BT":
                        if not settings.BT_MAC_ADDRESS:
                            return False, "Bluetooth MAC address not configured"
                        
                        # Use asyncio to run the Bluetooth scan
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                        devices = loop.run_until_complete(self._scan_bluetooth_devices())
                        loop.close()
                        
                        if settings.BT_MAC_ADDRESS not in devices:
                            return False, f"Device {settings.BT_MAC_ADDRESS} not found"
                        
                        # For Bluetooth connection, we'll use a virtual COM port
                        portstr = f"COM0"  # This will be assigned by Windows
                    else:
                        portstr = settings.OBD_PORT

                    self.connection = obd.OBD(
                        portstr=portstr,
                        baudrate=settings.OBD_BAUDRATE,
                        fast=settings.FAST_MODE,
                        timeout=settings.TIMEOUT,
                        check_voltage=False
                    )
                    
                    if self.connection.is_connected():
                        if settings.DEBUG_MODE:
                            print(f"ELM327 Connection successful via {settings.CONNECTION_TYPE}")
                            print(f"Protocol: {self.connection.protocol_name()}")
                        return True, "Connected successfully"
                except Exception as e:
                    if attempt == settings.CONNECTION_RETRIES - 1:
                        raise e
                    continue
                    
        except Exception as e:
            if settings.DEBUG_MODE:
                print(f"ELM327 Connection error: {str(e)}")
            return False, f"Failed to connect: {str(e)}"
    
    def get_all_data(self) -> Dict[str, Optional[float]]:
        """Get all available OBD data"""
        if self.simulation_mode:
            return self._get_simulated_data()
            
        if not self.connection or not self.connection.is_connected():
            return {}
            
        try:
            data: Dict[str, Optional[float]] = {}
            
            # Define field mappings from OBD commands to our schema names
            field_mappings = {
                'SPEED': 'speed',
                'RPM': 'rpm',
                'THROTTLE_POS': 'throttle_position',
                'ENGINE_LOAD': 'engine_load',
                'COOLANT_TEMP': 'coolant_temp',
                'INTAKE_TEMP': 'intake_temp',
                'FUEL_LEVEL': 'fuel_level',
                'TIMING_ADVANCE': 'timing_advance',
                'MAF': 'maf',
                'O2_B1S1': 'o2_voltage'
            }
            
            # Query all supported commands that return numeric values
            for command in self.connection.supported_commands:
                try:
                    name = field_mappings.get(command.name, command.name.lower())
                    response = self.connection.query(command)
                    if not response.is_null():
                        value = response.value
                        if hasattr(value, 'magnitude'):
                            data[name] = float(value.magnitude)
                        elif isinstance(value, (int, float)):
                            data[name] = float(value)
                except (ValueError, TypeError, AttributeError):
                    continue
                except Exception as e:
                    print(f"Error querying {command.name}: {str(e)}")
                    continue
            
            # Ensure all schema fields exist, even if null
            for schema_field in field_mappings.values():
                if schema_field not in data:
                    data[schema_field] = None
                        
            return data
        except Exception as e:
            print(f"Data fetch error: {e}")
            return {}

    def _get_simulated_data(self) -> Dict[str, Optional[float]]:
        """Generate simulated OBD data"""
        return {
            "speed": random.uniform(0, 120),
            "rpm": random.uniform(800, 3000),
            "throttle_position": random.uniform(0, 100),
            "engine_load": random.uniform(0, 100),
            "coolant_temp": random.uniform(60, 90),
            "intake_temp": random.uniform(20, 40),
            "fuel_level": random.uniform(0, 100),
            "timing_advance": random.uniform(0, 50),
            "maf": random.uniform(0, 100),
            "o2_voltage": random.uniform(0, 1)
        }

    def get_supported_commands(self) -> List[Dict[str, str]]:
        """Get all supported OBD commands with detailed information"""
        if not self.connection or not self.connection.is_connected():
            return []
            
        commands = []
        for cmd in self.connection.supported_commands:
            mode = str(cmd.mode) if cmd.mode is not None else "N/A"
            pid = str(cmd.pid) if cmd.pid is not None else "N/A"
            
            commands.append({
                "name": cmd.name or "Unknown",
                "description": cmd.desc or "No description",
                "command": str(cmd.command),
                "mode": mode,
                "pid": pid
            })
        return commands

    def start_continuous_monitoring(self):
        """Start continuous data monitoring in a separate thread"""
        if self.is_monitoring:
            return
            
        self.is_monitoring = True
        self.monitor_thread = threading.Thread(target=self._monitoring_loop)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()

    def stop_continuous_monitoring(self):
        """Stop continuous monitoring"""
        self.is_monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join()

    def _monitoring_loop(self):
        """Continuous monitoring loop"""
        while self.is_monitoring:
            self.last_data = self.get_all_data()
            time.sleep(settings.MONITORING_INTERVAL)

    def get_last_data(self) -> Dict[str, Optional[float]]:
        """Get the most recently cached data"""
        return self.last_data

    def simulate_acceleration(self, target_speed: float, duration: float = 5.0):
        """Simulate acceleration in simulation mode"""
        if settings.DEBUG_MODE:
            print(f"Simulation mode: {self.simulation_mode}")
            print(f"Attempting to simulate acceleration to {target_speed} km/h over {duration} seconds")
            
        if not self.simulation_mode:
            if settings.DEBUG_MODE:
                print("Simulation failed: Simulation mode is disabled")
            return False
            
        start_speed = self.last_data.get("speed", 0)
        if settings.DEBUG_MODE:
            print(f"Starting speed: {start_speed} km/h")
            
        speed_step = (target_speed - start_speed) / (duration / settings.MONITORING_INTERVAL)
        
        def _acceleration_thread():
            current_speed = start_speed
            steps = int(duration / settings.MONITORING_INTERVAL)
            
            for step in range(steps):
                current_speed += speed_step
                self.last_data["speed"] = current_speed
                self.last_data["rpm"] = current_speed * 30  # Simulate RPM change
                self.last_data["throttle_position"] = min(100, current_speed / target_speed * 100)
                if settings.DEBUG_MODE and step % 2 == 0:  # Print every other step
                    print(f"Speed: {current_speed:.1f} km/h, RPM: {self.last_data['rpm']:.0f}")
                time.sleep(settings.MONITORING_INTERVAL)
        
        threading.Thread(target=_acceleration_thread, daemon=True).start()
        return True
