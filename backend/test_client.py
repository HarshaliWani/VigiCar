import requests
import time
import json
from typing import Dict, Any, List

BASE_URL = "http://localhost:8000"

def print_pid_data(data: Dict[str, Any], timestamp: float):
    """Pretty print PID data with timestamp"""
    print(f"\n=== Data at {time.strftime('%H:%M:%S', time.localtime(timestamp))} ===")
    for key, value in sorted(data.items()):
        if value is not None:  # Only show PIDs that returned data
            if isinstance(value, float):
                print(f"{key:20}: {value:.2f}")
            else:
                print(f"{key:20}: {value}")

def print_supported_pids(commands: List[Dict[str, Any]]):
    """Print supported PIDs in a tabulated format"""
    print("\nSupported OBD Commands:")
    print(f"{'Name':<20} | {'Description':<40} | {'Mode':<6} | {'PID':<6}")
    print("-" * 80)
    
    try:
        for cmd in sorted(commands, key=lambda x: str(x.get('name', ''))):
            name = str(cmd.get('name', 'Unknown'))[:20]
            desc = str(cmd.get('description', 'No description'))[:40]
            mode = str(cmd.get('mode', 'N/A'))
            pid = str(cmd.get('pid', 'N/A'))
            
            print(f"{name:<20} | {desc:<40} | {mode:<6} | {pid:<6}")
    except Exception as e:
        print(f"Error formatting command data: {e}")
    
    print("-" * 80)
    print(f"Total supported commands: {len(commands)}")

def test_api():
    print("Testing VigiCar OBD API with real OBD connection...")
    
    # Test OBD connection
    print("\n1. Connecting to OBD interface...")
    try:
        response = requests.get(f"{BASE_URL}/connect")
        if response.status_code == 200:
            print("Successfully connected to OBD interface")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Failed to connect: {response.json()}")
            return
    except Exception as e:
        print(f"Connection error: {e}")
        return

    # Get supported commands
    print("\n2. Getting supported PIDs...")
    try:
        response = requests.get(f"{BASE_URL}/supported")
        if response.status_code == 200:
            commands = response.json()
            print_supported_pids(commands)
    except Exception as e:
        print(f"Error getting supported commands: {e}")

    # Continuous data monitoring
    print("\n3. Starting continuous PID monitoring...")
    print("Press Ctrl+C to stop monitoring")
    try:
        while True:
            try:
                response = requests.get(f"{BASE_URL}/data")
                if response.status_code == 200:
                    data = response.json()
                    if data:  # Only print if we have data
                        print_pid_data(data, time.time())
                    else:
                        print("No data received")
                else:
                    print(f"Error fetching data: {response.status_code}")
                time.sleep(1)
            except KeyboardInterrupt:
                print("\nMonitoring stopped by user")
                break
            except json.JSONDecodeError:
                print("Error: Invalid JSON response")
                time.sleep(1)
            except Exception as e:
                print(f"Error during monitoring: {str(e)}")
                time.sleep(1)
    except KeyboardInterrupt:
        print("\nTest client stopped by user")

if __name__ == "__main__":
    print("Make sure the FastAPI server is running (uvicorn app.main:app --reload)")
    time.sleep(2)
    test_api()
