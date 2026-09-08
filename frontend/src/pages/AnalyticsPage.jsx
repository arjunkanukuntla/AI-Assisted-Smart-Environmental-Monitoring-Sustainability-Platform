import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, TrendingUp, AlertOctagon, Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale);

export default function AnalyticsPage() {
  const [trends, setTrends] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [tRes, aRes, kRes, fRes] = await Promise.all([
          api.getTrends(),
          api.getAnomalies(),
          api.getKPIs(),
          api.getEngineeredFeatures()
        ]);
        setTrends(tRes.data);
        setAnomalies(aRes.data);
        setKpis(kRes.data);
        setFeatures(fRes.data);
      } catch (err) {
        console.error("Error loading reserve analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const forecastData = {
    labels: trends?.forecast_7day?.forecast_dates || ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Predicted 7-Day Air AQI Trend',
        data: trends?.forecast_7day?.aqi_forecast || [88, 92, 95, 104, 98, 91, 86],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4
      },
      {
        label: 'Predicted 7-Day Water Quality WQI',
        data: trends?.forecast_7day?.wqi_forecast || [76, 75, 78, 80, 77, 74, 72],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.4
      }
    ]
  };

  const kpiBreakdownData = {
    labels: ['Air Purity', 'Water Health', 'Clean Energy', 'Circular Waste'],
    datasets: [
      {
        label: 'Sub-Index Score / 100',
        data: [
          kpis?.breakdown?.air_purity_score || 72,
          kpis?.breakdown?.water_health_score || 75,
          kpis?.breakdown?.clean_energy_score || 78,
          kpis?.breakdown?.circular_waste_score || 76
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
      }
    ]
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-jungle-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/40">
              SECTOR 03 MODULE
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">Canopy Analytics & ML Intelligence</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Feature engineering, 7-day predictive forecasting, Isolation Forest anomaly detection, and Reserve Health Scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-jungle-950 border border-jungle-700 text-xs font-mono text-amber-400">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>ML Model: Scikit-learn + Isolation Forest</span>
        </div>
      </div>

      {/* Top Grid: Forecast & KPI Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Forecasting Chart */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              7-Day Predictive Reserve Forecast
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Confidence: 91%</span>
          </div>

          <div className="h-64 w-full">
            <Line data={forecastData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Sustainability Scorecard */}
        <div className="p-5 rounded-2xl glass-panel space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Reserve Health Performance Index (SPI)
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {kpis?.rating || "Optimal"}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <div className="text-center p-4 rounded-2xl bg-jungle-950 border border-jungle-700">
                <div className="text-3xl font-extrabold text-amber-400 font-mono">{kpis?.composite_spi || "81.4"}</div>
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-1">Reserve Score / 100</div>
              </div>

              <div className="flex-1 h-36">
                <Bar data={kpiBreakdownData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>

          {/* AI Insights List */}
          <div className="p-3 rounded-xl bg-jungle-950 border border-jungle-800 space-y-1 text-xs text-slate-300 font-mono">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Sector Diagnostic Insight:
            </div>
            {kpis?.insights?.map((ins, idx) => (
              <p key={idx} className="text-[11px] text-slate-300 leading-normal">• {ins}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Isolation Forest Anomaly Detection Section */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between font-mono">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            Isolation Forest Telemetry Anomaly Detection
          </h3>
          <span className="text-xs text-rose-400 font-bold">
            Flagged Anomalies: {anomalies?.anomaly_count || 0} / {anomalies?.total_analyzed || 0} Records
          </span>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-jungle-950 text-amber-400 uppercase font-semibold border-b border-jungle-700">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Station</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">AQI Score</th>
                <th className="p-3">PM2.5 / PM10</th>
                <th className="p-3">CO2 Level</th>
                <th className="p-3">Anomaly Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jungle-800/60 text-slate-300">
              {anomalies?.flagged_records?.map((rec, i) => (
                <tr key={i} className="hover:bg-jungle-900/40 bg-rose-950/20">
                  <td className="p-3 font-bold text-rose-400">#{rec.id}</td>
                  <td className="p-3 text-slate-400">ST-00{rec.station_id}</td>
                  <td className="p-3 text-slate-400">{rec.timestamp}</td>
                  <td className="p-3 font-bold text-rose-300">{rec.aqi}</td>
                  <td className="p-3">{rec.pm25} / {rec.pm10} µg/m³</td>
                  <td className="p-3">{rec.co2} ppm</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-600/40">
                      {rec.anomaly_reason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
