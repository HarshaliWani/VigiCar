from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from app.main import app
import obd

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@patch('obd.OBD')
def test_connect_success(mock_obd):
    # Mock successful connection
    mock_connection = Mock()
    mock_connection.is_connected.return_value = True
    mock_obd.return_value = mock_connection

    response = client.get("/connect")
    assert response.status_code == 200
    assert response.json() == {"status": "connected"}

@patch('obd.OBD')
def test_connect_failure(mock_obd):
    # Mock failed connection
    mock_connection = Mock()
    mock_connection.is_connected.return_value = False
    mock_obd.return_value = mock_connection

    response = client.get("/connect")
    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to connect to OBD"}

@patch('obd.OBD')
def test_get_obd_data_success(mock_obd):
    # Mock successful data retrieval
    mock_connection = Mock()
    mock_connection.is_connected.return_value = True
    
    # Mock OBD command responses
    mock_response = Mock()
    mock_response.value = 1500
    mock_response.is_null.return_value = False
    mock_connection.query.return_value = mock_response
    
    mock_obd.return_value = mock_connection

    response = client.get("/data")
    assert response.status_code == 200
    data = response.json()
    assert "speed" in data
    assert "rpm" in data
    assert "throttle_position" in data
    assert "engine_load" in data
    assert "coolant_temp" in data

@patch('obd.OBD')
def test_get_obd_data_failure(mock_obd):
    # Mock failed data retrieval
    mock_connection = Mock()
    mock_connection.is_connected.return_value = False
    mock_obd.return_value = mock_connection

    response = client.get("/data")
    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to fetch OBD data"}
