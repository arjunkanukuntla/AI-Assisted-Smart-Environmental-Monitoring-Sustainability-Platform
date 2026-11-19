import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Radio, CloudSun, Globe, Satellite, Zap, RefreshCw } from 'lucide-react';

const panelCls = 'bg-[#121215] border border-[#27272A] rounded-lg';
const metricTile = 'p-3 bg-[#09090B] rounded-md border border-[#27272A]';

export default function IntegrationPage() {
  const [weather, setWeather] = useState(null);
  const [benchmarks, setBenchmarks] = useState(null);
  const [satellite, setSatellite] = useState(null);
  const [iotTicks, setIotTicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = async () => {
    try {
      const [wRes, bRes, sRes, tRes] = await Promise.all([
        api.getWeather(), api.getOpenAQBenchmarks(),
        api.getSatelliteImagery(), api.getIoTTick()
      ]);
      setWeather(wRes.data);
      setBenchmarks(bRes.data);
      setSatellite(sRes.data);
      setIotTicks(prev => [tRes.data, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error('Integration load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadIntegrations(); }, []);

  const handleTick = async () => {
    try {
      const res = await api.getIoTTick();
      setIotTicks(prev => [res.data, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error('IoT tick error:', err);
    }
  };

  return (
    <div className="space-y-5 font-sans">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Radio className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">IoT Mesh &amp; Gateway Integrations</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time interfaces with Open-Meteo atmospheric models, NASA EONET events, and live IoT sensor mesh.
          </p>
        </div>
        <button
          onClick={loadIntegrations}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-[#27272A] transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feeds
        </button>
      </div>

      {/* Top grid: Weather + Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Weather */}
        <div className={`${panelCls} overflow-hidden`}>
          <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <CloudSun className="w-3.5 h-3.5 text-zinc-400" />
              Open-Meteo Atmospheric Stream
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono font-medium">
              Synchronized
            </span>
          </div>
          {weather ? (
            <div className="p-4 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-bold text-white font-mono tabular-nums">{weather.temp_c}°C</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Feels like {weather.feels_like_c}°C · {weather.weather_condition}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-white">{weather.location}</div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">{weather.source}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className={metricTile}>
                  <div className="text-xs text-zinc-400 mb-0.5">Humidity</div>
                  <div className="text-sm font-semibold text-sky-400 font-mono tabular-nums">{weather.humidity_pct}%</div>
                </div>
                <div className={metricTile}>
                  <div className="text-xs text-zinc-400 mb-0.5">Wind Speed</div>
                  <div className="text-sm font-semibold text-white font-mono tabular-nums">{weather.wind_speed_kmh} km/h</div>
                </div>
                <div className={metricTile}>
                  <div className="text-xs text-zinc-400 mb-0.5">UV Index</div>
                  <div className="text-sm font-semibold text-amber-400 font-mono tabular-nums">{weather.uv_index}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-zinc-500">Loading atmospheric feed…</div>
          )}
        </div>

        {/* Benchmarks */}
        <div className={`${panelCls} overflow-hidden`}>
          <div className="flex items-center gap-2 p-4 border-b border-[#27272A] text-xs font-semibold text-white">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            Atmospheric Benchmarks &amp; Baselines
          </div>
          {benchmarks ? (
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {[
                { label: 'US AQI Baseline', value: benchmarks.us_aqi || 70, color: 'text-white' },
                { label: 'PM2.5 Density', value: `${benchmarks.pm25 || 15.0} µg/m³`, color: 'text-zinc-200' },
                { label: 'PM10 Density', value: `${benchmarks.pm10 || 27.5} µg/m³`, color: 'text-sky-400' },
                { label: 'Ozone Concentration', value: `${benchmarks.ozone_ppb || 109.0} ppb`, color: 'text-zinc-300' },
              ].map((m, i) => (
                <div key={i} className={metricTile}>
                  <div className="text-xs text-zinc-400 mb-1">{m.label}</div>
                  <div className={`text-lg font-semibold font-mono tabular-nums ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-zinc-500">Loading benchmark baselines…</div>
          )}
        </div>

      </div>

      {/* Bottom grid: Satellite + IoT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Satellite */}
        <div className={`${panelCls} overflow-hidden`}>
          <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Satellite className="w-3.5 h-3.5 text-zinc-400" />
              NASA EONET Remote Sensing Feed
            </div>
            <span className="text-xs text-zinc-400 font-mono">{satellite?.satellite}</span>
          </div>
          <div className="divide-y divide-[#27272A]">
            {satellite?.layers?.map((layer, i) => (
              <div key={i} className="p-3.5 hover:bg-[#18181B] transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-white">{layer.layer_name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                    {layer.category}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">{layer.source} · {layer.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* IoT Stream */}
        <div className={`${panelCls} overflow-hidden`}>
          <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Radio className="w-3.5 h-3.5 text-zinc-400" />
              Hardware Mesh Telemetry Stream
            </div>
            <button
              onClick={handleTick}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
            >
              <Zap className="w-3 h-3 text-zinc-950" />
              Trigger Ingestion Tick
            </button>
          </div>
          <div className="divide-y divide-[#27272A] max-h-72 overflow-y-auto">
            {iotTicks.length === 0 && (
              <div className="p-6 text-center text-xs text-zinc-500">No telemetry ticks received.</div>
            )}
            {iotTicks.map((tick, i) => (
              <div key={i} className="p-3.5 hover:bg-[#18181B] transition-colors flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-medium text-white font-mono">{tick.sensor_id} ({tick.station_code})</div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">{new Date(tick.timestamp).toLocaleTimeString()}</div>
                </div>
                <div className="text-right font-mono tabular-nums text-xs space-y-0.5">
                  <div className="text-white">AQI: <strong>{tick.readings?.aqi ?? '—'}</strong></div>
                  <div className="text-zinc-400 text-xs">
                    PM2.5: {tick.readings?.pm25 ?? '—'}
                    {tick.readings?.ph != null && ` · pH ${tick.readings.ph}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
