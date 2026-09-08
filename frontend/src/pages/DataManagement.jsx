import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Database, Plus, Search, Filter, RefreshCw, CheckCircle, MapPin, Activity } from 'lucide-react';

export default function DataManagement() {
  const [activeSubTab, setActiveSubTab] = useState('stations');
  const [stations, setStations] = useState([]);
  const [airRecords, setAirRecords] = useState([]);
  const [waterRecords, setWaterRecords] = useState([]);
  const [wasteSchedules, setWasteSchedules] = useState([]);
  const [biodiversity, setBiodiversity] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Station modal form
  const [showAddStation, setShowAddStation] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '', code: '', station_type: 'Air', latitude: 17.40, longitude: 78.45, status: 'Active', location_name: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [st, air, water, waste, bio] = await Promise.all([
        api.getStations(),
        api.getAirRecords(),
        api.getWaterRecords(),
        api.getWasteSchedules(),
        api.getBiodiversity()
      ]);
      setStations(st.data);
      setAirRecords(air.data);
      setWaterRecords(water.data);
      setWasteSchedules(waste.data);
      setBiodiversity(bio.data);
    } catch (err) {
      console.error("Error fetching telemetry records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStation = async (e) => {
    e.preventDefault();
    try {
      await api.createStation(newStation);
      setShowAddStation(false);
      fetchData();
    } catch (err) {
      alert("Failed to create station: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-jungle-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40">
              SECTOR 02 MODULE
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">Reserve Sensor & Data Registry</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Centralized registry for sector monitoring stations, canopy telemetry logs, waste pickup nodes, and species observations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-jungle-900 hover:bg-jungle-800 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 transition border border-jungle-700"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            Refresh Feed
          </button>

          <button
            onClick={() => setShowAddStation(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Register Station
          </button>
        </div>
      </div>

      {/* Sub Tab Selection */}
      <div className="flex items-center space-x-2 border-b border-jungle-700 pb-2 overflow-x-auto font-mono">
        {[
          { id: 'stations', label: `Monitoring Stations (${stations.length})` },
          { id: 'air', label: `Air Telemetry (${airRecords.length})` },
          { id: 'water', label: `Water Health (${waterRecords.length})` },
          { id: 'waste', label: `Waste Nodes (${wasteSchedules.length})` },
          { id: 'biodiversity', label: `Species Observations (${biodiversity.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-jungle-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tab Tables */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        {activeSubTab === 'stations' && (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-jungle-950 text-amber-400 uppercase font-semibold border-b border-jungle-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Station Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jungle-800/60 text-slate-300">
                {stations.map((st) => (
                  <tr key={st.id} className="hover:bg-jungle-900/40">
                    <td className="p-3 font-bold text-amber-400">#{st.id}</td>
                    <td className="p-3 font-semibold text-slate-100">{st.name}</td>
                    <td className="p-3 text-slate-400">{st.code}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-jungle-900 text-emerald-300 border border-jungle-700">
                        {st.station_type}
                      </span>
                    </td>
                    <td className="p-3">{st.location_name}</td>
                    <td className="p-3 text-slate-400">{st.latitude}, {st.longitude}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/30">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'air' && (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-jungle-950 text-amber-400 uppercase font-semibold border-b border-jungle-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Station</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">AQI</th>
                  <th className="p-3">PM2.5</th>
                  <th className="p-3">PM10</th>
                  <th className="p-3">CO2</th>
                  <th className="p-3">Status Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jungle-800/60 text-slate-300">
                {airRecords.slice(0, 15).map((rec) => (
                  <tr key={rec.id} className="hover:bg-jungle-900/40">
                    <td className="p-3">#{rec.id}</td>
                    <td className="p-3 text-slate-400">ST-00{rec.station_id}</td>
                    <td className="p-3 text-slate-400">{new Date(rec.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-bold text-amber-400">{rec.aqi}</td>
                    <td className="p-3">{rec.pm25} µg/m³</td>
                    <td className="p-3">{rec.pm10} µg/m³</td>
                    <td className="p-3">{rec.co2} ppm</td>
                    <td className="p-3">
                      {rec.is_anomaly ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                          Anomaly Flagged
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'waste' && (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-jungle-950 text-amber-400 uppercase font-semibold border-b border-jungle-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Zone Name</th>
                  <th className="p-3">Collector</th>
                  <th className="p-3">Fill Level</th>
                  <th className="p-3">Waste Type</th>
                  <th className="p-3">Scheduled Time</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jungle-800/60 text-slate-300">
                {wasteSchedules.map((ws) => (
                  <tr key={ws.id} className="hover:bg-jungle-900/40">
                    <td className="p-3">#{ws.id}</td>
                    <td className="p-3 font-semibold text-slate-100">{ws.zone_name}</td>
                    <td className="p-3 text-slate-400">{ws.collector_assigned}</td>
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        ws.bin_capacity_pct >= 90 ? 'bg-rose-950 text-rose-300 border border-rose-500' : 'bg-jungle-900 text-slate-300'
                      }`}>
                        {ws.bin_capacity_pct}%
                      </span>
                    </td>
                    <td className="p-3">{ws.waste_type}</td>
                    <td className="p-3 text-slate-400">{ws.scheduled_time}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        {ws.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Station Modal */}
      {showAddStation && (
        <div className="fixed inset-0 z-50 bg-jungle-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-jungle-900 border border-jungle-700 p-6 rounded-2xl w-full max-w-md space-y-4 font-mono">
            <h3 className="text-base font-bold text-amber-400 uppercase">Register Bio-Reserve Sensor Station</h3>
            <form onSubmit={handleCreateStation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Station Name</label>
                <input
                  type="text" required
                  value={newStation.name}
                  onChange={e => setNewStation({...newStation, name: e.target.value})}
                  className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  placeholder="e.g. Sector 4 Canopy Station"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Station Code</label>
                  <input
                    type="text" required
                    value={newStation.code}
                    onChange={e => setNewStation({...newStation, code: e.target.value})}
                    className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                    placeholder="ST-006"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Station Type</label>
                  <select
                    value={newStation.station_type}
                    onChange={e => setNewStation({...newStation, station_type: e.target.value})}
                    className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Air">Air Quality</option>
                    <option value="Water">Water Quality</option>
                    <option value="Multi-sensor">Multi-sensor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Location Name</label>
                <input
                  type="text" required
                  value={newStation.location_name}
                  onChange={e => setNewStation({...newStation, location_name: e.target.value})}
                  className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  placeholder="Canopy Zone B"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button" onClick={() => setShowAddStation(false)}
                  className="px-4 py-2 rounded-xl bg-jungle-950 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Save Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
