import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AlertTriangle, Send, Trophy, Users, X, MapPin } from 'lucide-react';

const panelCls = 'bg-[#121215] border border-[#27272A] rounded-lg';
const inputCls = 'w-full px-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors';
const selectCls = 'w-full px-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white focus:outline-none focus:border-zinc-400 transition-colors';

function SeverityBadge({ sev }) {
  const cls = sev === 'Severe' || sev === 'High'
    ? 'bg-red-500/10 text-red-300 border-red-500/30'
    : sev === 'Moderate'
    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    : 'bg-zinc-800 text-zinc-300 border-zinc-700';
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded border font-medium font-sans ${cls}`}>
      {sev}
    </span>
  );
}

export default function PublicPortal() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [campaigns, setCampaigns] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Air Pollution', severity: 'Moderate',
    description: '', location_name: '', latitude: 17.40, longitude: 78.45, reported_by: 'Observer'
  });

  const loadPortalData = async () => {
    try {
      const [incRes, alertRes, campRes] = await Promise.all([
        api.getIncidents(), api.getAlerts(), api.getCampaigns()
      ]);
      setIncidents(incRes.data);
      setAlerts(alertRes.data);
      setCampaigns(campRes.data);
    } catch (err) {
      console.error('Error loading portal data:', err);
    }
  };

  useEffect(() => { loadPortalData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitIncident(formData);
      setShowSubmitModal(false);
      setFormData({ title: '', category: 'Air Pollution', severity: 'Moderate', description: '', location_name: '', latitude: 17.40, longitude: 78.45, reported_by: 'Observer' });
      loadPortalData();
    } catch (err) {
      alert('Failed to submit: ' + err.message);
    }
  };

  const set = (key) => (e) => setFormData(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-5 font-sans">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <AlertTriangle className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Community Environmental Reports</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Spot smoke, open waste burning, or water pollution? Submit an observation so local teams can respond.
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-zinc-950" />
          Submit a Report
        </button>
      </div>

      {/* Summary stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {[
          {
            icon: Users,
            value: campaigns?.total_community_volunteers || 1420,
            label: 'Community Observers Active'
          },
          {
            icon: Trophy,
            value: `${campaigns?.co2_reduction_ytd_tons || 384.5} t`,
            label: 'Verified Emission Reductions'
          },
          {
            icon: AlertTriangle,
            value: `${alerts.length} Active`,
            label: 'Local Safety Advisories'
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${panelCls} p-4 flex items-center gap-3.5`}>
              <div className="w-8 h-8 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-zinc-300" />
              </div>
              <div>
                <div className="text-xl font-semibold text-white font-mono tabular-nums">{stat.value}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Incident log */}
        <div className={`${panelCls} overflow-hidden`}>
          <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              Active Incident Reports ({incidents.length})
            </div>
          </div>
          <div className="divide-y divide-[#27272A] max-h-[480px] overflow-y-auto">
            {incidents.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-400">No active incidents reported.</div>
            )}
            {incidents.map(inc => (
              <div key={inc.id} className="p-4 hover:bg-[#18181B] transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-medium text-white leading-tight" style={{ textWrap: 'balance' }}>
                    {inc.title}
                  </span>
                  <SeverityBadge sev={inc.severity} />
                </div>
                <p className="text-xs text-zinc-400 mb-2.5 leading-relaxed" style={{ textWrap: 'pretty' }}>
                  {inc.description}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>{inc.location_name}</span>
                  <span className="text-zinc-300">{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conservation campaigns */}
        <div className={`${panelCls} overflow-hidden`}>
          <div className="flex items-center gap-2 p-4 border-b border-[#27272A] text-xs font-semibold text-white">
            <Trophy className="w-3.5 h-3.5 text-zinc-400" />
            Mitigation &amp; Conservation Initiatives
          </div>
          <div className="divide-y divide-[#27272A]">
            {campaigns?.initiatives?.map(init => (
              <div key={init.id} className="p-4 hover:bg-[#18181B] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{init.title}</span>
                  <span className="text-xs font-mono tabular-nums text-zinc-200 font-semibold">{init.current_progress_pct}%</span>
                </div>
                <div className="w-full bg-[#09090B] h-1.5 rounded-full overflow-hidden border border-[#27272A] mb-2">
                  <div
                    className="h-full bg-zinc-200 rounded-full"
                    style={{ width: `${init.current_progress_pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>{init.target_metric}</span>
                  <span>{init.lead_agency}</span>
                  <span className="text-white font-medium">{init.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Incident Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-[#27272A] rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Log Environmental Incident</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Incident Summary</label>
                <input type="text" required value={formData.title} onChange={set('title')}
                  className={inputCls} placeholder="e.g. Chemical discharge detected in canal" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <select value={formData.category} onChange={set('category')} className={selectCls}>
                    <option>Air Pollution</option>
                    <option>Water Contamination</option>
                    <option>Illegal Dumping</option>
                    <option>Deforestation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Severity</label>
                  <select value={formData.severity} onChange={set('severity')} className={selectCls}>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Severe</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Location / Site</label>
                <input type="text" required value={formData.location_name} onChange={set('location_name')}
                  className={inputCls} placeholder="e.g. Hussain Sagar North Basin, Hyderabad" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Observation Details</label>
                <textarea rows={3} required value={formData.description} onChange={set('description')}
                  className={`${inputCls} resize-none`} placeholder="Provide sensor readings or physical observations…" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowSubmitModal(false)}
                  className="px-3.5 py-2 rounded-md text-xs text-zinc-300 hover:text-white bg-[#18181B] border border-[#27272A] transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-4 py-2 rounded-md text-xs text-zinc-950 font-semibold bg-white hover:bg-zinc-200 transition-colors shadow-sm">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
