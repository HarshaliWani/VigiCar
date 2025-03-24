from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, MagicMock
from app.main import app
from app.services.ai_service import ask_groq_ai, generate_ai_insights, generate_ai_diagnostics

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
    assert response.json() == {"status": "connected", "message": "Connected successfully"}

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

@patch('obd.OBD')
def test_get_obd_data_failure(mock_obd):
    # Mock failed data retrieval
    mock_connection = Mock()
    mock_connection.is_connected.return_value = False
    mock_obd.return_value = mock_connection

    response = client.get("/data")
    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to fetch OBD data"}

@patch("app.services.ai_service.requests.post")
def test_ask_groq_ai_success(mock_post):
    # Mock response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [{"message": {"content": "This is a mock response"}}]
    }
    mock_post.return_value = mock_response

    # Test function
    user_query = "Why is my fuel efficiency low?"
    obd_data = {"speed": 60, "rpm": 2000, "throttle": 30, "engine_load": 50, "fuel_level": 70, "coolant_temp": 90}
    response = ask_groq_ai(user_query, obd_data)

    # Assertions
    assert response == "This is a mock response"
    mock_post.assert_called_once()

@patch("app.services.ai_service.requests.post")
def test_generate_ai_insights_success(mock_post):
    # Mock response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [{"message": {"content": {"driving_tips": [{"tip": "Drive slower", "details": "Driving slower improves fuel efficiency"}]}}}]
    }
    mock_post.return_value = mock_response

    # Test function
    obd_data = {"speed": 60, "rpm": 2000, "throttle": 30, "engine_load": 50, "fuel_level": 70, "coolant_temp": 90}
    response = generate_ai_insights(obd_data)

    # Assertions
    assert "driving_tips" in response
    assert response["driving_tips"][0]["tip"] == "Drive slower"
    mock_post.assert_called_once()

@patch("app.services.ai_service.requests.post")
def test_generate_ai_diagnostics_success(mock_post):
    # Mock response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [{"message": {"content": {"insights": [{"title": "Low Fuel Efficiency", "description": "Your fuel efficiency is below average"}], "warnings": [{"title": "High RPM", "description": "Your RPM is too high"}]}}}]
    }
    mock_post.return_value = mock_response

    # Test function
    obd_data = {"speed": 60, "rpm": 2000, "throttle": 30, "engine_load": 50, "fuel_level": 70, "coolant_temp": 90}
    response = generate_ai_diagnostics(obd_data)

    # Assertions
    assert "insights" in response
    assert "warnings" in response
    assert response["insights"][0]["title"] == "Low Fuel Efficiency"
    assert response["warnings"][0]["title"] == "High RPM"
    mock_post.assert_called_once()