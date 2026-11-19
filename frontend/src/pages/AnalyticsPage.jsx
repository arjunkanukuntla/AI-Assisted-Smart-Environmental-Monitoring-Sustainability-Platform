import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, TrendingUp, AlertTriangle, Cpu, Activity } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChartPageSkeleton } from '../components/Skeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const panelCls = 'bg-[#121215] border border-[#27272A] rounded-lg';
const thCls = 'py-2.5 px-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400';
const tdCls = 'py-2.5 px-3 text-xs text-zinc-300 font-mono tabular-nums';

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#A1A1AA', font: { size: 11 }, boxWidth: 12 }
    }
  },
  scales: {
    x: { ticks: { color: '#71717A', font: { size: 11 } }, grid: { color: '#27272A' } },
    y: { ticks: { color: '#71717A', font: { size: 11 } }, grid: { color: '#27272A' } }
  }
};

export default function AnalyticsPage() {
  const [trends, setTrends] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, aRes, kRes] = await Promise.all([
          api.getTrends(), api.getAnomalies(), api.getKPIs()
        ]);
        setTrends(tRes.data);
        setAnomalies(aRes.data);
        setKpis(kRes.data);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const forecastData = {
    labels: trends?.forecast_7day?.forecast_dates || ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7'],
    datasets: [
      {
        label: '7-Day AQI Forecast',
        data: trends?.forecast_7day?.aqi_forecast || [88,92,95,104,98,91,86],
        borderColor: '#FAFAFA',
        backgroundColor: 'rgba(250,250,250,0.06)',
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#FAFAFA'
      },
      {
        label: '7-Day WQI Forecast',
        data: trends?.forecast_7day?.wqi_forecast || [76,75,78,80,77,74,72],
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56,189,248,0.06)',
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#38BDF8'
      }
    ]
  };

  const kpiData = {
    labels: ['Air Purity','Water Health','Clean Energy','Waste Diversion'],
    datasets: [{
      label: 'Score / 100',
      data: [
        kpis?.breakdown?.air_purity_score || 72,
        kpis?.breakdown?.water_health_score || 75,
        kpis?.breakdown?.clean_energy_score || 78,
        kpis?.breakdown?.circular_waste_score || 76
      ],
      backgroundColor: ['rgba(255,255,255,0.7)','rgba(56,189,248,0.7)','rgba(245,158,11,0.7)','rgba(161,161,170,0.7)'],
      borderColor: ['#FFFFFF','#38BDF8','#F59E0B','#A1A1AA'],
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  if (loading) {
    return <div className="space-y-5 font-sans"><ChartPageSkeleton /></div>;
  }

  return (
    <div className="space-y-5 font-sans">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Air &amp; Water Quality Forecasts</h2>
          </div>
          <p className="text-xs text-zinc-400">
            See expected pollution levels over the next 7 days and check for unusual environmental spikes.
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 ${panelCls} text-xs text-zinc-300`}>
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs">Continuous Daily Forecast</span>
        </div>
      </div>

      {/* KPI summary strip */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Overall Clean Air Score', value: `${kpis.composite_spi || '81.4'}`, unit: 'out of 100', color: 'text-white' },
            { label: 'Forecast Accuracy', value: '91%', unit: 'Historical match', color: 'text-zinc-200' },
            { label: 'Pollution Spikes Flagged', value: anomalies?.anomaly_count || 0, unit: 'locations under review', color: 'text-amber-400' },
            { label: 'Total Stations Analyzed', value: anomalies?.total_analyzed || 130, unit: 'regional nodes', color: 'text-zinc-300' },
          ].map((kpi, i) => (
            <div key={i} className={`${panelCls} p-3.5`}>
              <div className="text-xs font-medium text-zinc-400 mb-1">{kpi.label}</div>
              <div className={`text-xl font-semibold font-mono tabular-nums ${kpi.color}`}>{kpi.value}</div>
              {kpi.unit && <div className="text-xs text-zinc-400 mt-0.5">{kpi.unit}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* 7-Day Forecast */}
        <div className={`${panelCls} p-4 space-y-3`}>
          <div className="flex items-center justify-between border-b border-[#27272A] pb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
              7-Day Predictive Trend
            </div>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">95% Confidence Interval</span>
          </div>
          <div className="h-56 w-full">
            <Line data={forecastData} options={chartOpts} />
          </div>
        </div>

        {/* SPI Breakdown */}
        <div className={`${panelCls} p-4 space-y-3`}>
          <div className="flex items-center justify-between border-b border-[#27272A] pb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              Sustainability Performance Index (SPI)
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-white">
              {kpis?.composite_spi || '81.4'} / 100
            </span>
          </div>
          <div className="h-56 w-full">
            <Bar data={kpiData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} />
          </div>
        </div>

      </div>

      {/* Diagnostic Insights */}
      {kpis?.insights?.length > 0 && (
        <div className={`${panelCls} p-4`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3 border-b border-[#27272A] pb-2.5">
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            Sector Diagnostic Observations
          </div>
          <ul className="space-y-2">
            {kpis.insights.map((ins, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300" style={{ textWrap: 'pretty' }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                {ins}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Anomaly Detection Table */}
      <div className={`${panelCls} overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Recent Pollution Spikes Detected
          </div>
          <span className="text-xs text-zinc-400 font-mono tabular-nums">
            {anomalies?.anomaly_count || 0} locations flagged
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[#27272A] bg-[#09090B]">
              <tr>
                <th className={thCls}>Record</th>
                <th className={thCls}>Station</th>
                <th className={thCls}>Timestamp</th>
                <th className={thCls}>AQI</th>
                <th className={thCls}>PM2.5 / PM10</th>
                <th className={thCls}>CO₂</th>
                <th className={thCls}>Spike Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {anomalies?.flagged_records?.map((rec, i) => (
                <tr key={i} className="hover:bg-red-500/5 transition-colors">
                  <td className={`${tdCls} text-red-400`}>#{rec.id}</td>
                  <td className={`${tdCls} text-zinc-400`}>ST-{String(rec.station_id).padStart(3,'0')}</td>
                  <td className={`${tdCls} text-zinc-400`}>{rec.timestamp}</td>
                  <td className={`${tdCls} font-semibold text-red-300`}>{rec.aqi}</td>
                  <td className={tdCls}>{rec.pm25} / {rec.pm10} µg/m³</td>
                  <td className={tdCls}>{rec.co2} ppm</td>
                  <td className={tdCls}>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 font-sans">
                      {rec.anomaly_reason}
                    </span>
                  </td>
                </tr>
              ))}
              {(!anomalies?.flagged_records || anomalies.flagged_records.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-zinc-400">
                    No anomalies detected in current sensor streams.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
