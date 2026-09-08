import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_waste_route_optimization():
    response = client.get("/api/v1/optimization/waste-route")
    assert response.status_code == 200
    data = response.json()
    assert "total_optimized_km" in data
    assert "fuel_saved_liters" in data
    assert "co2_saved_kg" in data

def test_energy_balance():
    response = client.get("/api/v1/optimization/energy-balance?demand=500&solar=400&battery=100")
    assert response.status_code == 200
    data = response.json()
    assert data["grid_power_drawn_kw"] == 0.0

def test_algorithm_benchmark():
    response = client.get("/api/v1/optimization/algorithm-benchmark?nodes=10")
    assert response.status_code == 200
    data = response.json()
    assert "heuristic_solver" in data
    assert "brute_force_solver" in data
