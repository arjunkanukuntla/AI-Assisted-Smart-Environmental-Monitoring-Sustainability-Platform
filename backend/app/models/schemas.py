from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from app.database import Base

# ==========================================
# SQLAlchemy ORM Models
# ==========================================

class StationModel(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    station_type = Column(String)  # Air, Water, Weather, Multi-sensor
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="Active")  # Active, Maintenance, Offline
    location_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    air_records = relationship("AirQualityRecordModel", back_populates="station", cascade="all, delete-orphan")
    water_records = relationship("WaterQualityRecordModel", back_populates="station", cascade="all, delete-orphan")


class AirQualityRecordModel(Base):
    __tablename__ = "air_quality_records"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id"))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    aqi = Column(Float)
    pm25 = Column(Float)
    pm10 = Column(Float)
    co2 = Column(Float)
    no2 = Column(Float)
    so2 = Column(Float)
    o3 = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    is_anomaly = Column(Boolean, default=False)

    station = relationship("StationModel", back_populates="air_records")


class WaterQualityRecordModel(Base):
    __tablename__ = "water_quality_records"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id"))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    ph = Column(Float)
    turbidity_ntu = Column(Float)
    dissolved_oxygen_mg_l = Column(Float)
    temperature_c = Column(Float)
    conductivity_us_cm = Column(Float)
    contaminants_ppm = Column(Float)
    wqi = Column(Float)  # Water Quality Index (0-100)
    is_anomaly = Column(Boolean, default=False)

    station = relationship("StationModel", back_populates="water_records")


class WasteScheduleModel(Base):
    __tablename__ = "waste_schedules"

    id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String, index=True)
    collector_assigned = Column(String)
    bin_capacity_pct = Column(Float)
    waste_type = Column(String)  # Organic, Recyclable, Hazardous, E-Waste
    latitude = Column(Float)
    longitude = Column(Float)
    scheduled_time = Column(String)
    status = Column(String, default="Pending")  # Pending, In Progress, Completed
    optimized_route_order = Column(Integer, default=0)


class EnergyRecordModel(Base):
    __tablename__ = "energy_records"

    id = Column(Integer, primary_key=True, index=True)
    facility_name = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    solar_generation_kw = Column(Float)
    grid_consumption_kw = Column(Float)
    battery_storage_kw = Column(Float)
    carbon_footprint_kg = Column(Float)
    renewable_percentage = Column(Float)


class BiodiversityObservationModel(Base):
    __tablename__ = "biodiversity_observations"

    id = Column(Integer, primary_key=True, index=True)
    species_name = Column(String, index=True)
    category = Column(String)  # Flora, Fauna, Avian, Aquatic
    count = Column(Integer)
    habitat_zone = Column(String)
    threat_level = Column(String)  # Low, Vulnerable, Endangered, Critical
    observed_by = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    observed_at = Column(DateTime, default=datetime.utcnow)


class IncidentReportModel(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)  # Air Pollution, Chemical Spill, Illegal Dumping, Deforestation, Water Contamination
    severity = Column(String)  # Low, Moderate, High, Severe
    status = Column(String, default="Reported")  # Reported, Investigating, Resolved
    description = Column(Text)
    location_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    reported_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class SustainabilityInitiativeModel(Base):
    __tablename__ = "sustainability_initiatives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    target_metric = Column(String)
    current_progress_pct = Column(Float)
    lead_agency = Column(String)
    start_date = Column(String)
    target_date = Column(String)
    status = Column(String, default="On Track")  # On Track, Delayed, Completed


class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    alert_level = Column(String)  # Info, Warning, Critical
    category = Column(String)
    message = Column(Text)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


# ==========================================
# Pydantic Schemas for API Requests & Responses
# ==========================================

class StationBase(BaseModel):
    name: str
    code: str
    station_type: str
    latitude: float
    longitude: float
    status: str = "Active"
    location_name: str

class StationCreate(StationBase):
    pass

class Station(StationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AirQualityCreate(BaseModel):
    station_id: int
    aqi: float
    pm25: float
    pm10: float
    co2: float
    no2: float
    so2: float
    o3: float
    temperature: float
    humidity: float

class AirQualityRecord(AirQualityCreate):
    id: int
    timestamp: datetime
    is_anomaly: bool

    class Config:
        from_attributes = True


class WaterQualityCreate(BaseModel):
    station_id: int
    ph: float
    turbidity_ntu: float
    dissolved_oxygen_mg_l: float
    temperature_c: float
    conductivity_us_cm: float
    contaminants_ppm: float

class WaterQualityRecord(WaterQualityCreate):
    id: int
    timestamp: datetime
    wqi: float
    is_anomaly: bool

    class Config:
        from_attributes = True


class WasteScheduleCreate(BaseModel):
    zone_name: str
    collector_assigned: str
    bin_capacity_pct: float
    waste_type: str
    latitude: float
    longitude: float
    scheduled_time: str
    status: str = "Pending"

class WasteSchedule(WasteScheduleCreate):
    id: int
    optimized_route_order: int

    class Config:
        from_attributes = True


class EnergyRecordCreate(BaseModel):
    facility_name: str
    solar_generation_kw: float
    grid_consumption_kw: float
    battery_storage_kw: float

class EnergyRecord(EnergyRecordCreate):
    id: int
    timestamp: datetime
    carbon_footprint_kg: float
    renewable_percentage: float

    class Config:
        from_attributes = True


class BiodiversityObservationCreate(BaseModel):
    species_name: str
    category: str
    count: int
    habitat_zone: str
    threat_level: str
    observed_by: str
    latitude: float
    longitude: float

class BiodiversityObservation(BiodiversityObservationCreate):
    id: int
    observed_at: datetime

    class Config:
        from_attributes = True


class IncidentReportCreate(BaseModel):
    title: str
    category: str
    severity: str
    description: str
    location_name: str
    latitude: float
    longitude: float
    reported_by: str = "Citizen"

class IncidentReport(IncidentReportCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AlertSchema(BaseModel):
    id: int
    title: str
    alert_level: str
    category: str
    message: str
    location: str
    timestamp: datetime
    is_active: bool

    class Config:
        from_attributes = True
