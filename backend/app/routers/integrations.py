from fastapi import APIRouter
from app.services.external_apis import external_services

router = APIRouter(prefix="/api/v1/integrations", tags=["Phase 5 - Service Integrations & IoT Feed"])

@router.get("/weather")
def get_external_weather(lat: float = 17.3850, lon: float = 78.4866):
    return external_services.fetch_openweather_data(lat, lon)

@router.get("/openaq-benchmarks")
def get_openaq_benchmarks():
    return external_services.fetch_openaq_benchmarks()

@router.get("/satellite-imagery")
def get_satellite_imagery():
    return external_services.get_satellite_imagery_layers()

@router.get("/iot-live-tick")
def get_iot_tick():
    return external_services.generate_iot_sensor_tick()
