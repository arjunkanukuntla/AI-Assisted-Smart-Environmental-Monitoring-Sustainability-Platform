from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.schemas import (
    IncidentReportModel, AlertModel, SustainabilityInitiativeModel,
    IncidentReport, IncidentReportCreate, AlertSchema
)

router = APIRouter(prefix="/api/v1/public", tags=["Phase 4 - Public Collaboration & Alert Portal"])

@router.get("/incidents", response_model=List[IncidentReport])
def get_public_incidents(db: Session = Depends(get_db)):
    return db.query(IncidentReportModel).order_by(IncidentReportModel.created_at.desc()).all()

@router.post("/incidents", response_model=IncidentReport)
def submit_public_incident(incident: IncidentReportCreate, db: Session = Depends(get_db)):
    db_inc = IncidentReportModel(**incident.model_dump())
    db.add(db_inc)
    db.commit()
    db.refresh(db_inc)

    # Automatically generate broadcast alert if severity is High or Severe
    if incident.severity in ["High", "Severe"]:
        new_alert = AlertModel(
            title=f"ALERT: {incident.category} in {incident.location_name}",
            alert_level="Critical" if incident.severity == "Severe" else "Warning",
            category=incident.category,
            message=incident.description,
            location=incident.location_name
        )
        db.add(new_alert)
        db.commit()

    return db_inc

@router.get("/alerts", response_model=List[AlertSchema])
def get_active_alerts(db: Session = Depends(get_db)):
    return db.query(AlertModel).filter(AlertModel.is_active == True).order_by(AlertModel.timestamp.desc()).all()

@router.get("/campaigns")
def get_community_campaigns(db: Session = Depends(get_db)):
    initiatives = db.query(SustainabilityInitiativeModel).all()
    return {
        "active_campaigns": len(initiatives),
        "total_community_volunteers": 1420,
        "co2_reduction_ytd_tons": 384.5,
        "initiatives": initiatives
    }
