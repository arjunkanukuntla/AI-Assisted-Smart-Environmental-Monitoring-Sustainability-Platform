import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analytics_trends():
    response = client.get("/api/v1/analytics/trends")
    assert response.status_code == 200
    data = response.json()
    assert "forecast_7day" in data
    assert len(data["forecast_7day"]["aqi_forecast"]) == 7

def test_anomalies():
    response = client.get("/api/v1/analytics/anomalies")
    assert response.status_code == 200
    data = response.json()
    assert "total_analyzed" in data

def test_sustainability_kpis():
    response = client.get("/api/v1/analytics/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "composite_spi" in data
    assert 0 <= data["composite_spi"] <= 100
