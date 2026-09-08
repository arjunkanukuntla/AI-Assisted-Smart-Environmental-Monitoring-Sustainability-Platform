# AI-Assisted Smart Environmental Monitoring & Sustainability Platform

![License](https://img.shields.io/badge/Status-Operational-brightgreen)
![Python](https://img.shields.io/badge/Backend-FastAPI_Python_3.12-blue)
![React](https://img.shields.io/badge/Frontend-React_Vite_Tailwind-cyan)

An intelligent, integrated platform that unifies environmental monitoring (air, water, weather, waste, energy, biodiversity, incidents), AI analytics (forecasting & anomaly detection), decision support optimization algorithms (waste routing TSP & energy balancing), citizen public collaboration, live external service integrations, and governance.

---

## 👥 Project Team Members
1. **P. Varshith**
2. **Snehith**
3. **Sai Vishal**
4. **Arjun**
5. **BV. Charan**

---

## 🌟 Key Capabilities across 6 Development Phases

### Phase 1: Intelligent Environmental Data & Resource Management
- Centralized database schema (SQLite / SQLAlchemy) for Stations, Air Quality, Water Quality, Waste Schedules, Energy Records, Biodiversity Observations, and Incidents.
- Automatic database seeder pre-loading realistic telemetry data across regional stations.

### Phase 2: Environmental Analytics & Sustainability Monitoring
- Data preprocessing & feature engineering routines (Rolling 24-hour moving averages, ratio metrics).
- 7-day predictive trend forecasting for AQI and Water Quality (Linear Regression + smoothing).
- Isolation Forest ML model for real-time sensor anomaly detection.
- Sustainability Scorecard calculating composite Sustainability Performance Index (SPI / 100).

### Phase 3: Intelligent Decision Support & Resource Optimization
- Waste Collection Route Solver: Nearest-Neighbor TSP heuristic graph solver with interactive Leaflet map path visualization, calculating distance, fuel liters saved, and $CO_2$ reduced.
- Microgrid Energy Load Balancer: Optimizes allocation between solar, battery storage, and grid.
- Automated TDD & Benchmark execution suite comparing $O(N \log N)$ heuristic vs $O(N!)$ brute force.

### Phase 4: Environmental Monitoring & Public Collaboration Portal
- Citizen incident submission form with real-time severity classification.
- Broadcast alert center for public safety warnings.
- Community sustainability initiatives & volunteer leaderboard.

### Phase 5: Smart Environmental Service Integrations & Automation
- Live OpenWeather API client with atmospheric metrics.
- OpenAQ global air quality cross-referencing benchmarks.
- Sentinel-2 satellite remote sensing layers (NDVI vegetation index & thermal mapping).
- Live IoT sensor telemetry stream tick simulator.

### Phase 6: System Integration, Deployment & Governance
- Responsible AI framework and environmental data governance disclosure.
- Interactive OpenAPI / Swagger documentation (`http://localhost:8000/docs`).
- Production Docker containerization setup (`Dockerfile`, `docker-compose.yml`).

---

## 🚀 Quick Start Guide

### 1. Launch FastAPI Backend
```bash
cd backend
python run.py
```
*Backend server runs at:* `http://localhost:8000`  
*Interactive Swagger API Docs:* `http://localhost:8000/docs`

### 2. Launch React Frontend
```bash
cd frontend
npm run dev
```
*Frontend web portal runs at:* `http://localhost:5173` (or `http://localhost:3000`)

### 3. Run Automated Pytest Suite
```bash
cd backend
pytest
```

---

## 🐳 Docker Deployment
```bash
docker-compose up --build
```
