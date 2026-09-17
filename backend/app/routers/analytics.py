from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas import AirQualityRecordModel, WaterQualityRecordModel, EnergyRecordModel, WasteScheduleModel
from app.services.ml_engine import ml_engine

router = APIRouter(prefix="/api/v1/analytics", tags=["Phase 2 - Analytics & Sustainability"])

@router.get("/trends")
def get_analytics_trends(db: Session = Depends(get_db)):
    air_records = db.query(AirQualityRecordModel).order_by(AirQualityRecordModel.timestamp.asc()).all()
    water_records = db.query(WaterQualityRecordModel).order_by(WaterQualityRecordModel.timestamp.asc()).all()

    air_aqis = [r.aqi for r in air_records[-24:] if r.aqi is not None]
    water_wqis = [r.wqi for r in water_records[-24:] if r.wqi is not None]

    if not air_aqis and not water_wqis:
        return {
            "status": "data_unavailable",
            "message": "Data Not Available - Pending Live Hardware Sensor Stream Connection",
            "historical_air_aqi": [],
            "historical_water_wqi": [],
            "recent_air_avg": None,
            "recent_water_avg": None,
            "forecast_7day": []
        }

    forecast = ml_engine.forecast_7day_trends(air_aqis if air_aqis else [70.0], water_wqis if water_wqis else [75.0])

    recent_air_avg = round(sum(air_aqis) / len(air_aqis), 1) if air_aqis else None
    recent_water_avg = round(sum(water_wqis) / len(water_wqis), 1) if water_wqis else None

    return {
        "status": "active",
        "historical_air_aqi": air_aqis,
        "historical_water_wqi": water_wqis,
        "recent_air_avg": recent_air_avg,
        "recent_water_avg": recent_water_avg,
        "forecast_7day": forecast
    }

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    air_records = db.query(AirQualityRecordModel).order_by(AirQualityRecordModel.timestamp.desc()).limit(40).all()
    records_dict = [
        {
            "id": r.id,
            "station_id": r.station_id,
            "timestamp": str(r.timestamp),
            "aqi": r.aqi,
            "pm25": r.pm25,
            "pm10": r.pm10,
            "co2": r.co2
        } for r in air_records
    ]
    
    anomalous_records = ml_engine.detect_anomalies(records_dict)
    flagged_only = [r for r in anomalous_records if r.get('is_anomaly')]

    return {
        "total_analyzed": len(records_dict),
        "anomaly_count": len(flagged_only),
        "flagged_records": flagged_only
    }

@router.get("/kpis")
def get_sustainability_kpis(db: Session = Depends(get_db)):
    air_records = db.query(AirQualityRecordModel).all()
    water_records = db.query(WaterQualityRecordModel).all()
    energy_records = db.query(EnergyRecordModel).all()

    avg_aqi = sum(r.aqi for r in air_records) / len(air_records) if air_records else 90.0
    avg_wqi = sum(r.wqi for r in water_records) / len(water_records) if water_records else 74.0
    avg_renewable = sum(r.renewable_percentage for r in energy_records) / len(energy_records) if energy_records else 76.5
    
    return ml_engine.calculate_sustainability_kpis(avg_aqi, avg_wqi, avg_renewable, waste_recycled_pct=78.2)

@router.get("/feature-engineering")
def get_engineered_features(db: Session = Depends(get_db)):
    air_records = db.query(AirQualityRecordModel).order_by(AirQualityRecordModel.timestamp.desc()).limit(30).all()
    records_dict = [
        {
            "id": r.id,
            "timestamp": str(r.timestamp),
            "aqi": r.aqi,
            "pm25": r.pm25,
            "pm10": r.pm10,
            "co2": r.co2
        } for r in air_records
    ]
    df = ml_engine.preprocess_telemetry(records_dict)
    return df.to_dict(orient="records")
