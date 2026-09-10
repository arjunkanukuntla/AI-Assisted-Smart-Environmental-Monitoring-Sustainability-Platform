import axios from 'axios';

const API_BASE = '/api/v1';

// Default fallback telemetry in case backend API is unreachable or building
const MOCK_STATIONS = [
  { id: 1, name: "Central Eco-Tower Station", code: "ST-001", station_type: "Air", latitude: 17.385043, longitude: 78.486671, status: "Active", location_name: "Downtown Core" },
  { id: 2, name: "Hussain Sagar Lake Station", code: "ST-002", station_type: "Water", latitude: 17.4239, longitude: 78.4738, status: "Active", location_name: "Hussain Sagar North" },
  { id: 3, name: "Greenbelt Reserve Station", code: "ST-003", station_type: "Multi-sensor", latitude: 17.4435, longitude: 78.3772, status: "Active", location_name: "KBR National Park Area" },
  { id: 4, name: "Industrial Sector Monitor", code: "ST-004", station_type: "Air", latitude: 17.5140, longitude: 78.3840, status: "Active", location_name: "Panchavati Industrial Corridor" },
  { id: 5, name: "Musi River Basin Station", code: "ST-005", station_type: "Water", latitude: 17.3616, longitude=78.4747, status: "Active", location_name: "Musi River South" },
  { id: 6, name: "Warangal Smart Environmental Station", code: "ST-006", station_type: "Multi-sensor", latitude: 17.9784, longitude: 79.5941, status: "Active", location_name: "Warangal Kakatiya Corridor" }
];

const MOCK_AIR = [
  { id: 1, station_id: 1, timestamp: new Date().toISOString(), aqi: 65, pm25: 22.4, pm10: 45.0, co2: 412, no2: 18.5, so2: 8.2, o3: 25.0, temperature: 28.5, humidity: 60, is_anomaly: false },
  { id: 2, station_id: 4, timestamp: new Date().toISOString(), aqi: 145, pm25: 68.2, pm10: 110.5, co2: 520, no2: 42.0, so2: 22.1, o3: 48.0, temperature: 31.2, humidity: 52, is_anomaly: true },
  { id: 3, station_id: 6, timestamp: new Date().toISOString(), aqi: 68, pm25: 24.5, pm10: 48.0, co2: 415, no2: 18.2, so2: 6.5, o3: 28.0, temperature: 29.5, humidity: 62, is_anomaly: false }
];

const MOCK_WATER = [
  { id: 1, station_id: 2, timestamp: new Date().toISOString(), ph: 7.4, turbidity_ntu: 2.5, dissolved_oxygen_mg_l: 6.8, temperature_c: 25.0, conductivity_us_cm: 320, contaminants_ppm: 0.05, wqi: 88.5, is_anomaly: false },
  { id: 2, station_id: 5, timestamp: new Date().toISOString(), ph: 6.8, turbidity_ntu: 12.4, dissolved_oxygen_mg_l: 3.8, temperature_c: 26.5, conductivity_us_cm: 580, contaminants_ppm: 0.38, wqi: 45.2, is_anomaly: true },
  { id: 3, station_id: 6, timestamp: new Date().toISOString(), ph: 7.4, turbidity_ntu: 2.1, dissolved_oxygen_mg_l: 6.8, temperature_c: 26.2, conductivity_us_cm: 340, contaminants_ppm: 0.04, wqi: 87.0, is_anomaly: false }
];

const MOCK_WASTE = [
  { id: 1, zone_name: "Zone A - City Plaza", collector_assigned: "Truck 101", bin_capacity_pct: 88.5, waste_type: "Organic", latitude: 17.3870, longitude: 78.4890, scheduled_time: "08:00 AM", status: "Pending", optimized_route_order: 1 },
  { id: 2, zone_name: "Zone B - Green Park", collector_assigned: "Truck 101", bin_capacity_pct: 94.2, waste_type: "Recyclable", latitude: 17.4100, longitude: 78.4600, scheduled_time: "08:30 AM", status: "Pending", optimized_route_order: 2 },
  { id: 3, zone_name: "Zone C - Tech Park", collector_assigned: "Truck 102", bin_capacity_pct: 45.0, waste_type: "E-Waste", latitude: 17.4400, longitude: 78.3800, scheduled_time: "09:15 AM", status: "Pending", optimized_route_order: 4 },
  { id: 4, zone_name: "Warangal Urban Hub", collector_assigned: "Truck 104", bin_capacity_pct: 78.0, waste_type: "Organic", latitude: 17.9784, longitude: 79.5941, scheduled_time: "10:30 AM", status: "Pending", optimized_route_order: 3 }
];

const safeGet = async (apiCall, fallbackData) => {
  try {
    const res = await apiCall();
    return res;
  } catch (err) {
    console.warn("API call failed, using fallback data:", err.message);
    return { data: fallbackData };
  }
};

export const api = {
  // Phase 1 - Data Management
  getStations: () => safeGet(() => axios.get(`${API_BASE}/data/stations`), MOCK_STATIONS),
  createStation: (data) => axios.post(`${API_BASE}/data/stations`, data),
  getAirRecords: (stationId) => safeGet(() => axios.get(`${API_BASE}/data/air-records`, { params: { station_id: stationId } }), MOCK_AIR),
  getWaterRecords: (stationId) => safeGet(() => axios.get(`${API_BASE}/data/water-records`, { params: { station_id: stationId } }), MOCK_WATER),
  getWasteSchedules: () => safeGet(() => axios.get(`${API_BASE}/data/waste-schedules`), MOCK_WASTE),
  getEnergyRecords: () => safeGet(() => axios.get(`${API_BASE}/data/energy-records`), []),
  getBiodiversity: () => safeGet(() => axios.get(`${API_BASE}/data/biodiversity`), []),
  getInitiatives: () => safeGet(() => axios.get(`${API_BASE}/data/sustainability-initiatives`), []),

  // Phase 2 - Analytics
  getTrends: () => safeGet(() => axios.get(`${API_BASE}/analytics/trends`), { forecast_days: 7, historical_aqi: [65, 68, 70, 72, 69, 74, 71], predicted_aqi: [73, 75, 78, 80, 77, 76, 74] }),
  getAnomalies: () => safeGet(() => axios.get(`${API_BASE}/analytics/anomalies`), { anomalies_detected: 2, details: [] }),
  getKPIs: () => safeGet(() => axios.get(`${API_BASE}/analytics/kpis`), { sustainability_index: 84.5, air_quality_rating: "Moderate", water_quality_rating: "Good", active_incidents: 2 }),
  getEngineeredFeatures: () => safeGet(() => axios.get(`${API_BASE}/analytics/feature-engineering`), []),

  // Phase 3 - Optimization
  getWasteRoute: () => safeGet(() => axios.get(`${API_BASE}/optimization/waste-route`), { route: MOCK_WASTE, total_distance_km: 42.5, carbon_saved_kg: 18.4 }),
  getEnergyBalance: (demand, solar, battery) => 
    safeGet(() => axios.get(`${API_BASE}/optimization/energy-balance`, { params: { demand, solar, battery } }), { status: "Balanced", grid_draw_kw: 15.0 }),
  getBenchmark: (nodes = 15) => safeGet(() => axios.get(`${API_BASE}/optimization/algorithm-benchmark`, { params: { nodes } }), { runtime_ms: 12.4, efficiency_score: 96.2 }),

  // Phase 4 - Public Portal
  getIncidents: () => safeGet(() => axios.get(`${API_BASE}/public/incidents`), []),
  submitIncident: (data) => axios.post(`${API_BASE}/public/incidents`, data),
  getAlerts: () => safeGet(() => axios.get(`${API_BASE}/public/alerts`), [
    { id: 1, title: "Elevated PM2.5 in Industrial Zone", alert_level: "Warning", category: "Air Quality", message: "PM2.5 levels at Industrial Sector Monitor reached 115 µg/m³.", location: "Panchavati Industrial Corridor", timestamp: new Date().toISOString() }
  ]),
  getCampaigns: () => safeGet(() => axios.get(`${API_BASE}/public/campaigns`), []),

  // Phase 5 - Integrations
  getWeather: () => safeGet(() => axios.get(`${API_BASE}/integrations/weather`), { city: "Hyderabad / Warangal", temperature: 29.5, condition: "Partly Cloudy", humidity: 60 }),
  getOpenAQBenchmarks: () => safeGet(() => axios.get(`${API_BASE}/integrations/openaq-benchmarks`), []),
  getSatelliteImagery: () => safeGet(() => axios.get(`${API_BASE}/integrations/satellite-imagery`), { status: "Online" }),
  getIoTTick: () => safeGet(() => axios.get(`${API_BASE}/integrations/iot-live-tick`), { node: "ST-006", status: "Active" })
};
