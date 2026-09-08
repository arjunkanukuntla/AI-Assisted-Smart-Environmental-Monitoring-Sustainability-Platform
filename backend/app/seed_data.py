import random
from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models.schemas import (
    StationModel, AirQualityRecordModel, WaterQualityRecordModel,
    WasteScheduleModel, EnergyRecordModel, BiodiversityObservationModel,
    IncidentReportModel, SustainabilityInitiativeModel, AlertModel
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(StationModel).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with environmental telemetry and records...")

    # 1. Monitoring Stations
    stations = [
        StationModel(name="Central Eco-Tower Station", code="ST-001", station_type="Air", latitude=17.385043, longitude=78.486671, status="Active", location_name="Downtown Core"),
        StationModel(name="Hussain Sagar Lake Station", code="ST-002", station_type="Water", latitude=17.4239, longitude=78.4738, status="Active", location_name="Hussain Sagar North"),
        StationModel(name="Greenbelt Reserve Station", code="ST-003", station_type="Multi-sensor", latitude=17.4435, longitude=78.3772, status="Active", location_name="KBR National Park Area"),
        StationModel(name="Industrial Sector Monitor", code="ST-004", station_type="Air", latitude=17.5140, longitude=78.3840, status="Active", location_name="Panchavati Industrial Corridor"),
        StationModel(name="Musi River Basin Station", code="ST-005", station_type="Water", latitude=17.3616, longitude=78.4747, status="Active", location_name="Musi River South")
    ]
    db.add_all(stations)
    db.commit()

    # 2. Historical Telemetry (Air & Water) - last 7 days
    now = datetime.utcnow()
    for station in stations:
        for hour in range(48):  # 48 hourly readings
            timestamp = now - timedelta(hours=hour)
            if station.station_type in ["Air", "Multi-sensor"]:
                base_aqi = random.uniform(45, 140) if "Industrial" not in station.name else random.uniform(110, 210)
                # Introduce occasional anomaly
                is_anomaly = random.random() < 0.05
                if is_anomaly:
                    base_aqi += random.uniform(100, 180)

                db.add(AirQualityRecordModel(
                    station_id=station.id,
                    timestamp=timestamp,
                    aqi=round(base_aqi, 1),
                    pm25=round(base_aqi * 0.45 + random.uniform(-5, 5), 1),
                    pm10=round(base_aqi * 0.7 + random.uniform(-10, 10), 1),
                    co2=round(415 + random.uniform(-15, 60), 1),
                    no2=round(random.uniform(12, 45), 1),
                    so2=round(random.uniform(5, 25), 1),
                    o3=round(random.uniform(18, 55), 1),
                    temperature=round(26.5 + random.uniform(-4, 6), 1),
                    humidity=round(62 + random.uniform(-15, 15), 1),
                    is_anomaly=is_anomaly
                ))

            if station.station_type in ["Water", "Multi-sensor"]:
                ph = round(random.uniform(6.8, 8.2), 2)
                turbidity = round(random.uniform(1.5, 12.0), 1)
                do = round(random.uniform(4.5, 8.5), 1)
                # WQI calculation approximation
                wqi = round((ph / 8.5 * 30) + (do / 8.0 * 40) + (max(0, 100 - turbidity * 5) * 0.3), 1)
                is_anomaly = turbidity > 10.0 or do < 4.0

                db.add(WaterQualityRecordModel(
                    station_id=station.id,
                    timestamp=timestamp,
                    ph=ph,
                    turbidity_ntu=turbidity,
                    dissolved_oxygen_mg_l=do,
                    temperature_c=round(24.0 + random.uniform(-2, 3), 1),
                    conductivity_us_cm=round(random.uniform(250, 650), 1),
                    contaminants_ppm=round(random.uniform(0.02, 0.45), 2),
                    wqi=min(100.0, max(10.0, wqi)),
                    is_anomaly=is_anomaly
                ))

    # 3. Waste Collection Schedules (Phase 3 Optimization target nodes)
    waste_nodes = [
        WasteScheduleModel(zone_name="Zone A - City Plaza", collector_assigned="Truck 101", bin_capacity_pct=88.5, waste_type="Organic", latitude=17.3870, longitude=78.4890, scheduled_time="08:00 AM", status="Pending", optimized_route_order=1),
        WasteScheduleModel(zone_name="Zone B - Green Park", collector_assigned="Truck 101", bin_capacity_pct=94.2, waste_type="Recyclable", latitude=17.4100, longitude=78.4600, scheduled_time="08:30 AM", status="Pending", optimized_route_order=2),
        WasteScheduleModel(zone_name="Zone C - Tech Park", collector_assigned="Truck 102", bin_capacity_pct=45.0, waste_type="E-Waste", latitude=17.4400, longitude=78.3800, scheduled_time="09:15 AM", status="Pending", optimized_route_order=4),
        WasteScheduleModel(zone_name="Zone D - Industrial Hub", collector_assigned="Truck 102", bin_capacity_pct=91.0, waste_type="Hazardous", latitude=17.5100, longitude=78.3900, scheduled_time="10:00 AM", status="Pending", optimized_route_order=3),
        WasteScheduleModel(zone_name="Zone E - River Market", collector_assigned="Truck 103", bin_capacity_pct=82.0, waste_type="Organic", latitude=17.3650, longitude=78.4720, scheduled_time="11:00 AM", status="Pending", optimized_route_order=5)
    ]
    db.add_all(waste_nodes)

    # 4. Energy Microgrid Consumption Records
    facilities = ["Eco-Tower Solar Plant", "Central Water Treatment Hub", "Smart City Datacenter"]
    for facility in facilities:
        for day in range(7):
            db.add(EnergyRecordModel(
                facility_name=facility,
                timestamp=now - timedelta(days=day),
                solar_generation_kw=round(random.uniform(450, 950), 1),
                grid_consumption_kw=round(random.uniform(120, 380), 1),
                battery_storage_kw=round(random.uniform(200, 500), 1),
                carbon_footprint_kg=round(random.uniform(85, 240), 1),
                renewable_percentage=round(random.uniform(65, 88), 1)
            ))

    # 5. Biodiversity Observations
    species = [
        BiodiversityObservationModel(species_name="Spot-billed Pelican", category="Avian", count=14, habitat_zone="Hussain Sagar Lake Wetland", threat_level="Vulnerable", observed_by="Officer Snehith", latitude=17.4250, longitude=78.4750),
        BiodiversityObservationModel(species_name="Indian Flying Fox", category="Fauna", count=35, habitat_zone="KBR National Park", threat_level="Low", observed_by="Officer Sai Vishal", latitude=17.4440, longitude=78.3780),
        BiodiversityObservationModel(species_name="Smooth-coated Otter", category="Aquatic", count=4, habitat_zone="Musi Sanctuary", threat_level="Endangered", observed_by="Officer Arjun", latitude=17.3620, longitude=78.4760)
    ]
    db.add_all(species)

    # 6. Environmental Incidents
    incidents = [
        IncidentReportModel(title="High Chemical Turbidity Spurt", category="Water Contamination", severity="High", status="Investigating", description="Sudden industrial discharge detected upstream near Musi River Station ST-005.", location_name="Musi River South", latitude=17.3616, longitude=78.4747, reported_by="AI Telemetry Alert"),
        IncidentReportModel(title="Overflowing E-Waste Bin at Tech Corridor", category="Illegal Dumping", severity="Moderate", status="Reported", description="Bin #E-14 fill capacity exceeded 95% near Block 4.", location_name="Tech Park Zone C", latitude=17.4400, longitude=78.3800, reported_by="P. Varshith")
    ]
    db.add_all(incidents)

    # 7. Sustainability Initiatives
    initiatives = [
        SustainabilityInitiativeModel(title="Urban Canopy 2026 Tree Planting", target_metric="50,000 Trees Planted", current_progress_pct=68.5, lead_agency="Municipal Greenery Board", start_date="2026-01-10", target_date="2026-12-31", status="On Track"),
        SustainabilityInitiativeModel(title="Zero Single-Use Plastic Mandate", target_metric="90% Reduction in Commercial Zones", current_progress_pct=82.0, lead_agency="Environmental Protection Agency", start_date="2025-06-01", target_date="2026-06-30", status="On Track"),
        SustainabilityInitiativeModel(title="Solar Microgrid Expansion Phase 2", target_metric="15 MW Installed Capacity", current_progress_pct=45.0, lead_agency="Clean Energy Authority", start_date="2026-03-01", target_date="2027-01-15", status="Delayed")
    ]
    db.add_all(initiatives)

    # 8. Active Alerts
    alerts = [
        AlertModel(title="Elevated PM2.5 in Industrial Zone", alert_level="Warning", category="Air Quality", message="PM2.5 levels at Industrial Sector Monitor reached 115 µg/m³. Sensitive groups advised to wear protective masks.", location="Panchavati Industrial Corridor"),
        AlertModel(title="Water Dissolved Oxygen Dip", alert_level="Critical", category="Water Quality", message="Dissolved oxygen dropped to 3.8 mg/L at Musi River Basin. Cleanup team dispatched.", location="Musi River South")
    ]
    db.add_all(alerts)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
