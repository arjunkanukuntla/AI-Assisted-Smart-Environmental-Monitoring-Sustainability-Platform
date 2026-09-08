import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, AlertTriangle, Send, Trophy, CheckCircle, MapPin, HeartHandshake } from 'lucide-react';

export default function PublicPortal() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [campaigns, setCampaigns] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Air Pollution', severity: 'Moderate', description: '', location_name: '', latitude: 17.40, longitude: 78.45, reported_by: 'Citizen'
  });

  const loadPortalData = async () => {
    try {
      const [incRes, alertRes, campRes] = await Promise.all([
        api.getIncidents(),
        api.getAlerts(),
        api.getCampaigns()
      ]);
      setIncidents(incRes.data);
      setAlerts(alertRes.data);
      setCampaigns(campRes.data);
    } catch (err) {
      console.error("Error loading portal data:", err);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await api.submitIncident(formData);
      setShowSubmitModal(false);
      setFormData({ title: '', category: 'Air Pollution', severity: 'Moderate', description: '', location_name: '', latitude: 17.40, longitude: 78.45, reported_by: 'Citizen' });
      loadPortalData();
    } catch (err) {
      alert("Failed to submit incident: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-jungle-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/40">
              SECTOR 05 MODULE
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">Ranger & Public Collaboration Portal</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Enable field rangers, researchers, and local citizens to log environmental observations and receive emergency alerts.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
        >
          <Send className="w-4 h-4 fill-slate-950" />
          Log Sector Incident
        </button>
      </div>

      {/* Community Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-purple-500/40 flex items-center gap-4 font-mono">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{campaigns?.total_community_volunteers || 1420}</div>
            <div className="text-xs text-slate-400 font-medium font-sans">Active Reserve Volunteers</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/40 flex items-center gap-4 font-mono">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{campaigns?.co2_reduction_ytd_tons || 384.5} Tons</div>
            <div className="text-xs text-slate-400 font-medium font-sans">Reserve $CO_2$ Reduced YTD</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/40 flex items-center gap-4 font-mono">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{alerts.length} Active</div>
            <div className="text-xs text-slate-400 font-medium font-sans">Perimeter Safety Warnings</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Reported Incidents & Campaign Initiatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citizen Reported Incidents List */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 font-mono">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            Field Ranger & Incident Log ({incidents.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 rounded-xl bg-jungle-950 border border-jungle-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm font-sans">{inc.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inc.severity === 'Severe' || inc.severity === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {inc.severity} Severity
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{inc.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Location: {inc.location_name}</span>
                  <span>Reported by: {inc.reported_by}</span>
                  <span className="text-emerald-400 font-bold">Status: {inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Initiatives & Campaigns */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-widest flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            Reserve Conservation Campaigns
          </h3>

          <div className="space-y-4">
            {campaigns?.initiatives?.map((init) => (
              <div key={init.id} className="p-4 rounded-xl bg-jungle-950 border border-jungle-700 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-100 font-sans">{init.title}</span>
                  <span className="text-emerald-400 font-mono">{init.current_progress_pct}%</span>
                </div>

                <div className="w-full bg-jungle-900 h-2 rounded-full overflow-hidden border border-jungle-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${init.current_progress_pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Target: {init.target_metric}</span>
                  <span>Lead: {init.lead_agency}</span>
                  <span className="text-emerald-300 font-bold">{init.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-jungle-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-jungle-900 border border-jungle-700 p-6 rounded-2xl w-full max-w-lg space-y-4 font-mono">
            <h3 className="text-base font-bold text-amber-400 uppercase">Log Field Incident Report</h3>
            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Issue Title</label>
                <input
                  type="text" required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  placeholder="e.g. Unusual Chemical Odor near Lake"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Air Pollution">Air Pollution</option>
                    <option value="Water Contamination">Water Contamination</option>
                    <option value="Illegal Dumping">Illegal Dumping</option>
                    <option value="Deforestation">Deforestation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Severity Level</label>
                  <select
                    value={formData.severity}
                    onChange={e => setFormData({...formData, severity: e.target.value})}
                    className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Location Name</label>
                <input
                  type="text" required
                  value={formData.location_name}
                  onChange={e => setFormData({...formData, location_name: e.target.value})}
                  className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100"
                  placeholder="e.g. Sector 5 Basin"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows="3" required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-jungle-950 border border-jungle-700 rounded-lg p-2 text-slate-100 font-sans"
                  placeholder="Provide observations..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button" onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-jungle-950 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-500 text-slate-950 font-bold"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
