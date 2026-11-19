import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ---------------------------------------------------------------------------
# Helper: get a valid admin Bearer token for auth-gated endpoints
# ---------------------------------------------------------------------------
def _get_admin_token() -> str:
    res = client.post("/api/v1/auth/login", json={
        "email": "admin@ecosphere.gov",
        "password": "admin123"
    })
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    return res.json()["access_token"]


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

def test_create_station_requires_auth():
    """Unauthenticated POST /stations must return 401."""
    payload = {
        "name": "Unauth Station",
        "code": "ST-UNAUTH-01",
        "station_type": "Air",
        "latitude": 17.400,
        "longitude": 78.450,
        "status": "Active",
        "location_name": "Test Location"
    }
    response = client.post("/api/v1/data/stations", json=payload)
    assert response.status_code == 401

def test_create_station():
    """Authenticated admin POST /stations must succeed."""
    token = _get_admin_token()
    code = f"ST-TEST-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "name": "Test Eco Station",
        "code": code,
        "station_type": "Air",
        "latitude": 17.400,
        "longitude": 78.450,
        "status": "Active",
        "location_name": "Test Location"
    }
    response = client.post(
        "/api/v1/data/stations",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == code

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
