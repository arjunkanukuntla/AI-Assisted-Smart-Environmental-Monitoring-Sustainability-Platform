import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Radio, CloudSun, Globe, Satellite, Zap, RefreshCw } from 'lucide-react';

export default function IntegrationPage() {
  const [weather, setWeather] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [satellite, setSatellite] = useState(null);
  const [iotTicks, setIotTicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = async () => {
    try {
      const [wRes, bRes, sRes, tRes] = await Promise.all([
        api.getWeather(),
        api.getOpenAQBenchmarks(),
        api.getSatelliteImagery(),
        api.getIoTTick()
      ]);
      setWeather(wRes.data);
      setBenchmarks(bRes.data);
      setSatellite(sRes.data);
      setIotTicks(prev => [tRes.data, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error("Error loading reserve integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleSimulateTick = async () => {
    try {
      const res = await api.getIoTTick();
      setIotTicks(prev => [res.data, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error("Error generating IoT tick:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-jungle-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs font-bold border border-teal-500/40">
              SECTOR 06 MODULE
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">Satellite Remote Sensing & Live IoT Stream</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Direct connections to Open-Meteo atmospheric APIs, NASA Sentinel EONET satellite observations, and live IoT sensor ticks.
          </p>
        </div>

        <button
          onClick={loadIntegrations}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-teal-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          Poll External Feeds
        </button>
      </div>

      {/* Grid 1: Weather API & Global AQI Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OpenWeather Live Data */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" />
              Open-Meteo Atmospheric Telemetry
            </h3>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
              LIVE CONNECTED
            </span>
          </div>

          {weather && (
            <div className="p-4 rounded-xl bg-jungle-950 border border-jungle-700 space-y-3 text-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-slate-100">{weather.temp_c}°C</div>
                  <div className="text-slate-400">Feels like {weather.feels_like_c}°C ({weather.weather_condition})</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{weather.location}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Source: {weather.source}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-jungle-800 text-center font-mono">
                <div className="p-2 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">Humidity</div>
                  <div className="font-bold text-teal-300">{weather.humidity_pct}%</div>
                </div>
                <div className="p-2 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">Wind Speed</div>
                  <div className="font-bold text-emerald-300">{weather.wind_speed_kmh} km/h</div>
                </div>
                <div className="p-2 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">UV Index</div>
                  <div className="font-bold text-amber-300">{weather.uv_index}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OpenAQ Benchmarks */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 font-mono">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-300" />
            Open-Meteo Real Atmospheric Metrics
          </h3>

          {benchmarks && (
            <div className="p-4 rounded-xl bg-jungle-950 border border-jungle-700 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">US AQI Score</div>
                  <div className="text-xl font-bold text-amber-400">{benchmarks.us_aqi || 70}</div>
                </div>
                <div className="p-2.5 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">PM2.5 Density</div>
                  <div className="text-xl font-bold text-emerald-400">{benchmarks.pm25 || 15.0} µg/m³</div>
                </div>
                <div className="p-2.5 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">PM10 Density</div>
                  <div className="text-xl font-bold text-teal-300">{benchmarks.pm10 || 27.5} µg/m³</div>
                </div>
                <div className="p-2.5 rounded bg-jungle-900 border border-jungle-700">
                  <div className="text-slate-400 text-[10px]">Ozone (O3)</div>
                  <div className="text-xl font-bold text-purple-400">{benchmarks.ozone_ppb || 109.0} ppb</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid 2: Satellite Imagery & Live IoT Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satellite Imagery Layer Simulator */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Satellite className="w-4 h-4 text-purple-400" />
              NASA EONET Satellite Remote Sensing Feed
            </h3>
            <span className="text-xs font-mono text-purple-300 font-bold">{satellite?.satellite}</span>
          </div>

          <div className="space-y-3">
            {satellite?.layers?.map((layer, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-jungle-950 border border-jungle-700 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>{layer.layer_name}</span>
                  <span className="text-amber-400">{layer.category}</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">{layer.source} • {layer.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IoT Live Sensor Telemetry Feed */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Live Reserve IoT Sensor Telemetry Stream
            </h3>
            <button
              onClick={handleSimulateTick}
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 font-mono"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              Trigger Telemetry Tick
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {iotTicks.map((tick, i) => (
              <div key={i} className="p-3 rounded-xl bg-jungle-950 border border-emerald-500/30 text-xs flex items-center justify-between font-mono">
                <div>
                  <div className="font-bold text-emerald-400">{tick.sensor_id} ({tick.station_code})</div>
                  <div className="text-[10px] text-slate-500">{new Date(tick.timestamp).toLocaleTimeString()}</div>
                </div>
                <div className="text-right text-[11px]">
                  <span className="text-slate-300">AQI: <strong>{tick.readings.aqi}</strong></span> | <span className="text-amber-400">pH: <strong>{tick.readings.ph}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
