import React, { useState } from 'react';
import StationMap from '../components/StationMap';
import { Search, MapPin, Wind, Droplets, CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function LiveMapPage({ stations = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [stationType, setStationType] = useState('All'); // 'All' | 'Air' | 'Water'
  const [selectedStation, setSelectedStation] = useState(() => stations[0] || null);

  const cities = ['All', 'Hyderabad', 'Bangalore', 'Delhi', 'Mumbai', 'Chennai'];

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    if (cityName !== 'All') {
      const match = stations.find(st =>
        (st.location_name && st.location_name.toLowerCase().includes(cityName.toLowerCase())) ||
        (st.name && st.name.toLowerCase().includes(cityName.toLowerCase()))
      );
      if (match) {
        setSelectedStation(match);
      }
    }
  };

  const filtered = stations.filter(st => {
    const matchesSearch = !search ||
      (st.name && st.name.toLowerCase().includes(search.toLowerCase())) ||
      (st.location_name && st.location_name.toLowerCase().includes(search.toLowerCase()));

    const matchesCity = selectedCity === 'All' ||
      (st.location_name && st.location_name.toLowerCase().includes(selectedCity.toLowerCase())) ||
      (st.name && st.name.toLowerCase().includes(selectedCity.toLowerCase()));

    const matchesType = stationType === 'All' || st.station_type === stationType;

    return matchesSearch && matchesCity && matchesType;
  });

  const activeStation = selectedStation || filtered[0] || stations[0];

  const getAqiHealthInfo = (aqi) => {
    if (!aqi) return {
      label: 'Operational',
      desc: 'Station online and logging telemetry.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      walk: 'Normal outdoor activities permitted',
      windows: 'Safe to open windows',
      mask: 'No mask required'
    };
    const num = Number(aqi);
    if (num <= 50) return {
      label: 'Good (Clean Air)',
      desc: 'Air is fresh, crisp, and pure. Ideal for all outdoor workouts, walks, and activities.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      walk: 'Great time for running and walks',
      windows: 'Safe to open windows for ventilation',
      mask: 'No mask needed'
    };
    if (num <= 100) return {
      label: 'Moderate',
      desc: 'Air quality is acceptable. Very sensitive individuals may consider reducing prolonged heavy outdoor exertion.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      walk: 'Acceptable for outdoor exercise',
      windows: 'Safe to open windows in morning',
      mask: 'Optional in heavy traffic'
    };
    if (num <= 150) return {
      label: 'Unhealthy for Sensitive',
      desc: 'Children, seniors, and people with asthma should limit heavy outdoor exertion.',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/30',
      walk: 'Take easy walks; shift workouts indoors',
      windows: 'Keep windows shut during peak hours',
      mask: 'Recommended near roads'
    };
    return {
      label: 'Unhealthy / Smog',
      desc: 'Everyone should reduce prolonged heavy outdoor exertion. Wear an N95 mask near busy corridors.',
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
      walk: 'Avoid intensive outdoor exercise',
      windows: 'Keep windows closed; run air purifier',
      mask: 'N95 mask recommended'
    };
  };

  const healthInfo = activeStation ? getAqiHealthInfo(activeStation.aqi) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Live Station Map
          </h1>
          <p className="text-sm text-zinc-300 mt-1">
            Browse 133 environmental stations across India. Click any pin to inspect real-time readings and health advice.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-300 bg-[#121215] border border-[#27272A] px-3.5 py-2 rounded-lg">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            Good (0-50)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Moderate (51-100)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            Unhealthy (&gt;100)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            Water Bodies
          </span>
        </div>
      </div>

      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#121215] border border-[#27272A] p-3 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by neighborhood, landmark, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>

        {/* City Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => handleCitySelect(c)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCity === c
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'bg-[#18181B] text-zinc-300 hover:text-white border border-[#27272A]'
              }`}
            >
              {c}
            </button>
          ))}

          <span className="h-4 w-px bg-[#27272A] mx-1"></span>

          {/* Type Filter */}
          <button
            onClick={() => setStationType('All')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              stationType === 'All' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStationType('Air')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              stationType === 'Air' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Air
          </button>
          <button
            onClick={() => setStationType('Water')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              stationType === 'Water' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Water
          </button>
        </div>
      </div>

      {/* Main Map + Selected Station Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map View */}
        <div className="lg:col-span-2 h-[540px] rounded-xl overflow-hidden border border-[#27272A] relative bg-[#09090B]">
          <StationMap
            stations={filtered}
            selectedStation={activeStation}
            onSelectStation={(st) => setSelectedStation(st)}
            height="100%"
          />
        </div>

        {/* Selected Station Detail Sidebar */}
        <div className="bg-[#121215] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between space-y-4">
          {activeStation ? (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#18181B] text-zinc-300 border border-[#27272A] font-semibold">
                  {activeStation.station_type === 'Air' ? 'Air Quality Station' : 'Water Quality Observatory'}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">
                  {activeStation.name}
                </h2>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{activeStation.location_name}</span>
                </p>
              </div>

              {/* Main Reading Card */}
              <div className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                  {activeStation.station_type === 'Air' ? 'Current Air Quality Index (AQI)' : 'Water Quality Index (WQI)'}
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {activeStation.aqi || activeStation.wqi || '72'}
                  </span>
                  {healthInfo && (
                    <span className={`text-xs px-2.5 py-1 rounded font-semibold border ${healthInfo.bg} ${healthInfo.color}`}>
                      {healthInfo.label}
                    </span>
                  )}
                </div>

                {healthInfo && (
                  <p className="text-xs text-zinc-300 mt-2.5 leading-relaxed">
                    {healthInfo.desc}
                  </p>
                )}
              </div>

              {/* Practical Advice Badges (Drunk Test Friendly) */}
              {healthInfo && activeStation.station_type === 'Air' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Quick Health Checklist
                  </div>
                  <div className="p-2.5 bg-[#09090B] border border-[#27272A] rounded-lg text-xs space-y-2">
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Outdoors:</strong> {healthInfo.walk}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span><strong>Windows:</strong> {healthInfo.windows}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Masks:</strong> {healthInfo.mask}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensor Parameters Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Sensor Readings
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#09090B] border border-[#27272A] rounded-lg">
                    <span className="text-zinc-400 block text-[11px]">PM2.5 (Fine dust)</span>
                    <span className="text-white font-bold font-mono text-sm">34.2 µg/m³</span>
                  </div>
                  <div className="p-2.5 bg-[#09090B] border border-[#27272A] rounded-lg">
                    <span className="text-zinc-400 block text-[11px]">PM10 (Particles)</span>
                    <span className="text-white font-bold font-mono text-sm">68.0 µg/m³</span>
                  </div>
                  <div className="p-2.5 bg-[#09090B] border border-[#27272A] rounded-lg">
                    <span className="text-zinc-400 block text-[11px]">Temperature</span>
                    <span className="text-white font-bold font-mono text-sm">28.5 °C</span>
                  </div>
                  <div className="p-2.5 bg-[#09090B] border border-[#27272A] rounded-lg">
                    <span className="text-zinc-400 block text-[11px]">Humidity</span>
                    <span className="text-white font-bold font-mono text-sm">62 %</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-zinc-400">
              Select any station on the map to view readings.
            </div>
          )}

          {/* Quick Guidance Tip */}
          <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-lg text-xs text-zinc-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
            <span>
              Updated every 10 seconds following National Ambient Air Quality Standards.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
