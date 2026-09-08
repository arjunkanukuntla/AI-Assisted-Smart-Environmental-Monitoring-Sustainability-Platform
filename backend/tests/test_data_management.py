import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Online & Operational"
    assert "P. Varshith" in data["team_members"]

def test_get_stations():
    response = client.get("/api/v1/data/stations")
    assert response.status_code == 200
    stations = response.json()
    assert isinstance(stations, list)
    assert len(stations) > 0

def test_create_station():
    payload = {
        "name": "Test Eco Station",
        "code": "ST-TEST-99",
        "station_type": "Air",
        "latitude": 17.400,
        "longitude": 78.450,
        "status": "Active",
        "location_name": "Test Location"
    }
    response = client.post("/api/v1/data/stations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == "ST-TEST-99"

def test_get_air_records():
    response = client.get("/api/v1/data/air-records")
    assert response.status_code == 200
    records = response.json()
    assert isinstance(records, list)

def test_get_waste_schedules():
    response = client.get("/api/v1/data/waste-schedules")
    assert response.status_code == 200
    schedules = response.json()
    assert isinstance(schedules, list)
