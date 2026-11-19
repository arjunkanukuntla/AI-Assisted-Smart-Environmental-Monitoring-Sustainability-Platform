import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Database, Plus, RefreshCw, X, Lock, ShieldCheck } from 'lucide-react';
import { PageSkeleton } from '../components/Skeleton';

const panelCls = 'bg-[#121215] border border-[#27272A] rounded-lg';
const thCls = 'py-2.5 px-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400';
const tdCls = 'py-2.5 px-3 text-xs text-zinc-300 font-mono tabular-nums';

function StatusBadge({ value }) {
  const lc = (value || '').toLowerCase();
  const cls = lc === 'active' || lc === 'normal'
    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    : lc.includes('anomaly') || lc.includes('critical')
    ? 'bg-red-500/10 text-red-300 border-red-500/30'
    : 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  return (
    <span className={`inline-block text-[11px] px-1.5 py-0.5 rounded border font-medium font-sans ${cls}`}>
      {value}
    </span>
  );
}

function TypeBadge({ type }) {
  const cls = type === 'Air'
    ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
    : type === 'Water'
    ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
    : 'bg-zinc-850 text-zinc-400 border-zinc-750';
  return (
    <span className={`inline-block text-[11px] px-1.5 py-0.5 rounded border font-medium font-mono ${cls}`}>
      {type}
    </span>
  );
}

export default function DataManagement() {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('stations');
  const [stations, setStations] = useState([]);
  const [airRecords, setAirRecords] = useState([]);
  const [waterRecords, setWaterRecords] = useState([]);
  const [wasteSchedules, setWasteSchedules] = useState([]);
  const [biodiversity, setBiodiversity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStation, setShowAddStation] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '', code: '', station_type: 'Air',
    latitude: 17.40, longitude: 78.45, status: 'Active', location_name: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [st, air, water, waste, bio] = await Promise.all([
        api.getStations(), api.getAirRecords(), api.getWaterRecords(),
        api.getWasteSchedules(), api.getBiodiversity()
      ]);
      setStations(st.data);
      setAirRecords(air.data);
      setWaterRecords(water.data);
      setWasteSchedules(waste.data);
      setBiodiversity(bio.data);
    } catch (err) {
      console.error('Error fetching telemetry records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateStation = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Restricted: Only authorized administrators can register new monitoring stations. Please sign in with administrator credentials.');
      openAuthModal();
      return;
    }
    try {
      await api.createStation(newStation);
      setShowAddStation(false);
      setNewStation({ name: '', code: '', station_type: 'Air', latitude: 17.40, longitude: 78.45, status: 'Active', location_name: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create station: ' + err.message);
    }
  };

  const subTabs = [
    { id: 'stations',    label: 'Stations',    count: stations.length },
    { id: 'air',         label: 'Air Records',  count: airRecords.length },
    { id: 'water',       label: 'Water Records',count: waterRecords.length },
    { id: 'waste',       label: 'Waste Nodes',  count: wasteSchedules.length },
    { id: 'biodiversity',label: 'Biodiversity', count: biodiversity.length },
  ];

  if (loading && stations.length === 0) {
    return <div className="space-y-5 font-sans"><PageSkeleton /></div>;
  }

  return (
    <div className="space-y-5 font-sans">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Database className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Stations Directory &amp; Sensor Records</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Search, filter, and inspect environmental monitoring stations and readings across India.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-[#27272A] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Provisioning Active</span>
              </span>
              <button
                onClick={() => setShowAddStation(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-950" />
                <span>Add Station</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18181B] border border-[#27272A] text-xs text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Station Registry (Verified Read-Only)</span>
              </div>
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-[#27272A] transition-colors"
                title="Only authorized administrators can provision new monitoring stations."
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In to Add Station</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-tab strip */}
      <div className={`${panelCls} p-1 flex items-center gap-1 overflow-x-auto`}>
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            {tab.label}
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
              activeSubTab === tab.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-850 text-zinc-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table panel */}
      <div className={`${panelCls} overflow-hidden`}>
        <div className="overflow-x-auto">

          {activeSubTab === 'stations' && (
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[#27272A] bg-[#09090B]">
                <tr>
                  <th className={thCls}>ID</th>
                  <th className={thCls}>Station Name</th>
                  <th className={thCls}>Code</th>
                  <th className={thCls}>Type</th>
                  <th className={thCls}>Location</th>
                  <th className={thCls}>Coordinates</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {stations.map(st => (
                  <tr key={st.id} className="hover:bg-[#18181B] transition-colors">
                    <td className={`${tdCls} text-zinc-400`}>#{st.id}</td>
                    <td className={`${tdCls} font-sans font-medium text-white`}>{st.name}</td>
                    <td className={`${tdCls} text-zinc-300 font-mono`}>{st.code}</td>
                    <td className={tdCls}><TypeBadge type={st.station_type} /></td>
                    <td className={`${tdCls} font-sans`}>{st.location_name}</td>
                    <td className={tdCls}>{st.latitude?.toFixed(4)}, {st.longitude?.toFixed(4)}</td>
                    <td className={tdCls}><StatusBadge value={st.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSubTab === 'air' && (
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[#27272A] bg-[#09090B]">
                <tr>
                  <th className={thCls}>ID</th>
                  <th className={thCls}>Station</th>
                  <th className={thCls}>Timestamp</th>
                  <th className={thCls}>AQI</th>
                  <th className={thCls}>PM2.5</th>
                  <th className={thCls}>PM10</th>
                  <th className={thCls}>CO₂</th>
                  <th className={thCls}>Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {airRecords.slice(0, 15).map(rec => (
                  <tr key={rec.id} className="hover:bg-[#18181B] transition-colors">
                    <td className={`${tdCls} text-zinc-400`}>#{rec.id}</td>
                    <td className={`${tdCls} text-zinc-300 font-mono`}>ST-{String(rec.station_id).padStart(3, '0')}</td>
                    <td className={`${tdCls} text-zinc-400`}>{new Date(rec.timestamp).toLocaleString()}</td>
                    <td className={`${tdCls} font-semibold text-white`}>{rec.aqi}</td>
                    <td className={tdCls}>{rec.pm25} µg/m³</td>
                    <td className={tdCls}>{rec.pm10} µg/m³</td>
                    <td className={tdCls}>{rec.co2} ppm</td>
                    <td className={tdCls}>
                      <StatusBadge value={rec.is_anomaly ? 'Anomaly' : 'Normal'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSubTab === 'water' && (
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[#27272A] bg-[#09090B]">
                <tr>
                  <th className={thCls}>ID</th>
                  <th className={thCls}>Station</th>
                  <th className={thCls}>Timestamp</th>
                  <th className={thCls}>WQI</th>
                  <th className={thCls}>pH</th>
                  <th className={thCls}>DO (mg/L)</th>
                  <th className={thCls}>Turbidity</th>
                  <th className={thCls}>Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {waterRecords.slice(0, 15).map(rec => (
                  <tr key={rec.id} className="hover:bg-[#18181B] transition-colors">
                    <td className={`${tdCls} text-zinc-400`}>#{rec.id}</td>
                    <td className={`${tdCls} text-sky-400 font-mono`}>ST-{String(rec.station_id).padStart(3, '0')}</td>
                    <td className={`${tdCls} text-zinc-400`}>{new Date(rec.timestamp).toLocaleString()}</td>
                    <td className={`${tdCls} font-semibold text-white`}>{rec.wqi}</td>
                    <td className={tdCls}>{rec.ph}</td>
                    <td className={tdCls}>{rec.do_level}</td>
                    <td className={tdCls}>{rec.turbidity} NTU</td>
                    <td className={tdCls}>
                      <StatusBadge value={rec.is_anomaly ? 'Anomaly' : 'Normal'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSubTab === 'waste' && (
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[#27272A] bg-[#09090B]">
                <tr>
                  <th className={thCls}>ID</th>
                  <th className={thCls}>Zone</th>
                  <th className={thCls}>Collector</th>
                  <th className={thCls}>Fill Level</th>
                  <th className={thCls}>Waste Type</th>
                  <th className={thCls}>Scheduled</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {wasteSchedules.map(ws => (
                  <tr key={ws.id} className="hover:bg-[#18181B] transition-colors">
                    <td className={`${tdCls} text-zinc-400`}>#{ws.id}</td>
                    <td className={`${tdCls} font-sans font-medium text-white`}>{ws.zone_name}</td>
                    <td className={`${tdCls} font-sans text-zinc-400`}>{ws.collector_assigned}</td>
                    <td className={tdCls}>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${
                        ws.bin_capacity_pct >= 90
                          ? 'bg-red-500/10 text-red-300 border-red-500/30'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {ws.bin_capacity_pct}%
                      </span>
                    </td>
                    <td className={`${tdCls} font-sans`}>{ws.waste_type}</td>
                    <td className={`${tdCls} text-zinc-400`}>{ws.scheduled_time}</td>
                    <td className={tdCls}><StatusBadge value={ws.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSubTab === 'biodiversity' && (
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[#27272A] bg-[#09090B]">
                <tr>
                  <th className={thCls}>ID</th>
                  <th className={thCls}>Species</th>
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Location</th>
                  <th className={thCls}>Observer</th>
                  <th className={thCls}>Count</th>
                  <th className={thCls}>Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {biodiversity.slice(0, 20).map(b => (
                  <tr key={b.id} className="hover:bg-[#18181B] transition-colors">
                    <td className={`${tdCls} text-zinc-400`}>#{b.id}</td>
                    <td className={`${tdCls} italic font-sans text-white`}>{b.species_name}</td>
                    <td className={`${tdCls} font-sans`}>{b.category}</td>
                    <td className={`${tdCls} font-sans text-zinc-400`}>{b.location_name}</td>
                    <td className={`${tdCls} font-sans text-zinc-400`}>{b.observer_name}</td>
                    <td className={`${tdCls} text-white`}>{b.count}</td>
                    <td className={`${tdCls} text-zinc-400`}>{b.recorded_at ? new Date(b.recorded_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>

      {/* Add Station Modal */}
      {showAddStation && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-[#27272A] rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Register Telemetry Node</h3>
              </div>
              <button
                onClick={() => setShowAddStation(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateStation} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Station Name</label>
                <input
                  type="text" required
                  value={newStation.name}
                  onChange={e => setNewStation({...newStation, name: e.target.value})}
                  className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
                  placeholder="e.g. Sector 4 Air Quality Node"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Station Code</label>
                  <input
                    type="text" required
                    value={newStation.code}
                    onChange={e => setNewStation({...newStation, code: e.target.value})}
                    className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
                    placeholder="ST-131"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Sensor Type</label>
                  <select
                    value={newStation.station_type}
                    onChange={e => setNewStation({...newStation, station_type: e.target.value})}
                    className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white focus:outline-none focus:border-zinc-400 transition-colors"
                  >
                    <option value="Air">Air Quality</option>
                    <option value="Water">Water Quality</option>
                    <option value="Multi-sensor">Multi-sensor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Location / District</label>
                <input
                  type="text" required
                  value={newStation.location_name}
                  onChange={e => setNewStation({...newStation, location_name: e.target.value})}
                  className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
                  placeholder="e.g. Industrial Sector B, Hyderabad"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStation(false)}
                  className="px-3.5 py-2 rounded-md text-xs text-zinc-300 hover:text-white bg-[#18181B] border border-[#27272A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-xs text-zinc-950 font-semibold bg-white hover:bg-zinc-200 transition-colors shadow-sm"
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