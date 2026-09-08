import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const api = {
  // Phase 1 - Data Management
  getStations: () => axios.get(`${API_BASE}/data/stations`),
  createStation: (data) => axios.post(`${API_BASE}/data/stations`, data),
  getAirRecords: (stationId) => axios.get(`${API_BASE}/data/air-records`, { params: { station_id: stationId } }),
  getWaterRecords: (stationId) => axios.get(`${API_BASE}/data/water-records`, { params: { station_id: stationId } }),
  getWasteSchedules: () => axios.get(`${API_BASE}/data/waste-schedules`),
  getEnergyRecords: () => axios.get(`${API_BASE}/data/energy-records`),
  getBiodiversity: () => axios.get(`${API_BASE}/data/biodiversity`),
  getInitiatives: () => axios.get(`${API_BASE}/data/sustainability-initiatives`),

  // Phase 2 - Analytics
  getTrends: () => axios.get(`${API_BASE}/analytics/trends`),
  getAnomalies: () => axios.get(`${API_BASE}/analytics/anomalies`),
  getKPIs: () => axios.get(`${API_BASE}/analytics/kpis`),
  getEngineeredFeatures: () => axios.get(`${API_BASE}/analytics/feature-engineering`),

  // Phase 3 - Optimization
  getWasteRoute: () => axios.get(`${API_BASE}/optimization/waste-route`),
  getEnergyBalance: (demand, solar, battery) => 
    axios.get(`${API_BASE}/optimization/energy-balance`, { params: { demand, solar, battery } }),
  getBenchmark: (nodes = 15) => axios.get(`${API_BASE}/optimization/algorithm-benchmark`, { params: { nodes } }),

  // Phase 4 - Public Portal
  getIncidents: () => axios.get(`${API_BASE}/public/incidents`),
  submitIncident: (data) => axios.post(`${API_BASE}/public/incidents`, data),
  getAlerts: () => axios.get(`${API_BASE}/public/alerts`),
  getCampaigns: () => axios.get(`${API_BASE}/public/campaigns`),

  // Phase 5 - Integrations
  getWeather: () => axios.get(`${API_BASE}/integrations/weather`),
  getOpenAQBenchmarks: () => axios.get(`${API_BASE}/integrations/openaq-benchmarks`),
  getSatelliteImagery: () => axios.get(`${API_BASE}/integrations/satellite-imagery`),
  getIoTTick: () => axios.get(`${API_BASE}/integrations/iot-live-tick`)
};
