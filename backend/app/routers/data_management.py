from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.schemas import (
    StationModel, AirQualityRecordModel, WaterQualityRecordModel,
    WasteScheduleModel, EnergyRecordModel, BiodiversityObservationModel,
    IncidentReportModel, SustainabilityInitiativeModel,
    Station, StationCreate, AirQualityRecord, AirQualityCreate,
    WaterQualityRecord, WaterQualityCreate, WasteSchedule, WasteScheduleCreate,
    EnergyRecord, EnergyRecordCreate, BiodiversityObservation, BiodiversityObservationCreate,
    IncidentReport, IncidentReportCreate
)

router = APIRouter(prefix="/api/v1/data", tags=["Phase 1 - Data & Resource Management"])

# --- Station CRUD ---
@router.get("/stations", response_model=List[Station])
def get_stations(db: Session = Depends(get_db)):
    return db.query(StationModel).all()

@router.post("/stations", response_model=Station)
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    db_station = StationModel(**station.model_dump())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station

@router.get("/stations/{station_id}", response_model=Station)
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(StationModel).filter(StationModel.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station

# --- Air Quality CRUD ---
@router.get("/air-records", response_model=List[AirQualityRecord])
def get_air_records(
    station_id: Optional[int] = None,
    limit: int = Query(default=100, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(AirQualityRecordModel)
    if station_id:
        query = query.filter(AirQualityRecordModel.station_id == station_id)
    return query.order_by(AirQualityRecordModel.timestamp.desc()).limit(limit).all()

@router.post("/air-records", response_model=AirQualityRecord)
def add_air_record(record: AirQualityCreate, db: Session = Depends(get_db)):
    is_anomaly = record.aqi > 200 or record.pm25 > 100
    db_record = AirQualityRecordModel(**record.model_dump(), is_anomaly=is_anomaly)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# --- Water Quality CRUD ---
@router.get("/water-records", response_model=List[WaterQualityRecord])
def get_water_records(
    station_id: Optional[int] = None,
    limit: int = Query(default=100, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(WaterQualityRecordModel)
    if station_id:
        query = query.filter(WaterQualityRecordModel.station_id == station_id)
    return query.order_by(WaterQualityRecordModel.timestamp.desc()).limit(limit).all()

@router.post("/water-records", response_model=WaterQualityRecord)
def add_water_record(record: WaterQualityCreate, db: Session = Depends(get_db)):
    wqi = (record.ph / 8.5 * 30) + (record.dissolved_oxygen_mg_l / 8.0 * 40) + (max(0, 100 - record.turbidity_ntu * 5) * 0.3)
    is_anomaly = record.turbidity_ntu > 10.0 or record.dissolved_oxygen_mg_l < 4.0
    db_record = WaterQualityRecordModel(**record.model_dump(), wqi=round(wqi, 1), is_anomaly=is_anomaly)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# --- Waste Schedules CRUD ---
@router.get("/waste-schedules", response_model=List[WasteSchedule])
def get_waste_schedules(db: Session = Depends(get_db)):
    return db.query(WasteScheduleModel).order_by(WasteScheduleModel.bin_capacity_pct.desc()).all()

@router.post("/waste-schedules", response_model=WasteSchedule)
def create_waste_schedule(schedule: WasteScheduleCreate, db: Session = Depends(get_db)):
    db_schedule = WasteScheduleModel(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

# --- Energy Records CRUD ---
@router.get("/energy-records", response_model=List[EnergyRecord])
def get_energy_records(db: Session = Depends(get_db)):
    return db.query(EnergyRecordModel).order_by(EnergyRecordModel.timestamp.desc()).limit(50).all()

# --- Biodiversity Observations ---
@router.get("/biodiversity", response_model=List[BiodiversityObservation])
def get_biodiversity(db: Session = Depends(get_db)):
    return db.query(BiodiversityObservationModel).all()

@router.post("/biodiversity", response_model=BiodiversityObservation)
def create_biodiversity(obs: BiodiversityObservationCreate, db: Session = Depends(get_db)):
    db_obs = BiodiversityObservationModel(**obs.model_dump())
    db.add(db_obs)
    db.commit()
    db.refresh(db_obs)
    return db_obs

# --- Sustainability Initiatives ---
@router.get("/sustainability-initiatives")
def get_initiatives(db: Session = Depends(get_db)):
    return db.query(SustainabilityInitiativeModel).all()
