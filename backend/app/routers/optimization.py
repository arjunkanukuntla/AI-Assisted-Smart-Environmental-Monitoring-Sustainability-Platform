from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas import WasteScheduleModel
from app.services.optimizer import optimizer

router = APIRouter(prefix="/api/v1/optimization", tags=["Phase 3 - Intelligent Decision Support & Optimization"])

@router.get("/waste-route")
def get_optimized_waste_route(db: Session = Depends(get_db)):
    waste_nodes = db.query(WasteScheduleModel).all()
    nodes_list = [
        {
            "id": n.id,
            "zone_name": n.zone_name,
            "collector_assigned": n.collector_assigned,
            "bin_capacity_pct": n.bin_capacity_pct,
            "waste_type": n.waste_type,
            "latitude": n.latitude,
            "longitude": n.longitude,
            "status": n.status
        }
        for n in waste_nodes
    ]

    result = optimizer.solve_waste_collection_route(nodes_list)
    return result

@router.get("/energy-balance")
def get_energy_load_balance(
    demand: float = Query(default=850.0, ge=10.0),
    solar: float = Query(default=600.0, ge=0.0),
    battery: float = Query(default=250.0, ge=0.0)
):
    return optimizer.optimize_energy_load(demand, solar, battery)

@router.get("/algorithm-benchmark")
def get_algorithm_benchmark(nodes: int = Query(default=15, ge=5, le=100)):
    return optimizer.benchmark_algorithms(nodes)
