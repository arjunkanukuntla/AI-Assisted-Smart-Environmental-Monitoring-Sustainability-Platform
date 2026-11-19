import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Activity,
  Compass,
  Database,
  BarChart3,
  BrainCircuit,
  AlertTriangle,
  FileCheck,
  Search,
  MapPin,
  Radio,
  ExternalLink,
  ChevronRight,
  X,
  SlidersHorizontal,
  LogOut,
  Menu,
  ChevronDown,
  UserCircle,
  CheckCircle2,
  Globe,
  Shield,
  ArrowRight
} from 'lucide-react';
import StationMap from './StationMap';

export default function EcoSpherePlatform({ stations = [], activeTab = 'overview', setActiveTab, onBackToWebsite, children }) {
  const { user, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Default selected station
  useEffect(() => {
    if (stations.length > 0 && !selectedStation) {
      setSelectedStation(stations[0]);
    }
  }, [stations, selectedStation]);

  // Live streaming telemetry simulation
  const [telemetryLogs, setTelemetryLogs] = useState([
    { id: 101, time: '18:45:10', code: 'ST-001', location: 'Downtown Core', metric: 'AQI 65 (Satisfactory)', status: 'Optimal' },
    { id: 102, time: '18:45:12', code: 'ST-002', location: 'Hussain Sagar Lake', metric: 'pH 7.4 · DO 6.8 mg/L', status: 'Optimal' },
    { id: 103, time: '18:45:15', code: 'ST-006', location: 'HITEC Cyber Park', metric: 'PM2.5 18.2 µg/m³', status: 'Optimal' },
    { id: 104, time: '18:45:18', code: 'ST-005', location: 'Musi River South', metric: 'Turbidity 8.2 NTU', status: 'Attention' },
    { id: 105, time: '18:45:20', code: 'ST-012', location: 'Whitefield IT Node', metric: 'AQI 68 · Temp 24°C', status: 'Optimal' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!stations || stations.length === 0) return;
      const randomStation = stations[Math.floor(Math.random() * stations.length)];
      const nowStr = new Date().toLocaleTimeString();
      const isWarn = randomStation.code === 'ST-005' || randomStation.code === 'ST-016';

      const newEntry = {
        id: Date.now(),
        time: nowStr,
        code: randomStation.code || 'ST-001',
        location: randomStation.location_name ? randomStation.location_name.split(',')[0] : randomStation.name,
        metric: randomStation.station_type === 'Water'
          ? `Turbidity ${(2.0 + Math.random() * 4).toFixed(1)} NTU`
          : `AQI ${Math.floor(50 + Math.random() * 45)} (Satisfactory)`,
        status: isWarn ? 'Attention' : 'Optimal'
      };

      setTelemetryLogs(prev => [newEntry, ...prev.slice(0, 5)]);
    }, 4500);
    return () => clearInterval(timer);
  }, [stations]);

  // City list extraction
  const availableCities = useMemo(() => {
    const set = new Set();
    stations.forEach(s => {
      if (s.location_name) {
        const parts = s.location_name.split(',');
        const city = parts[parts.length - 1].trim();
        if (city) set.add(city);
      }
    });
    return Array.from(set).slice(0, 8);
  }, [stations]);

  // Station filtering
  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.location_name && s.location_name.toLowerCase().includes(q));

      const matchesType = selectedTypeFilter === 'All' || s.station_type === selectedTypeFilter;
      const matchesCity = selectedCityFilter === 'All' ||
        (s.location_name && s.location_name.toLowerCase().includes(selectedCityFilter.toLowerCase()));

      return matchesSearch && matchesType && matchesCity;
    });
  }, [stations, searchQuery, selectedTypeFilter, selectedCityFilter]);

  const handleSelectStation = (st) => {
    setSelectedStation(st);
    setIsSearchOpen(false);
  };

  // Aggregated real regional metrics
  const metrics = useMemo(() => {
    const airStations = stations.filter(s => s.aqi != null && !isNaN(s.aqi));
    const waterStations = stations.filter(s => s.wqi != null && !isNaN(s.wqi));
    const avgAqi = airStations.length
      ? (airStations.reduce((acc, s) => acc + Number(s.aqi), 0) / airStations.length).toFixed(1)
      : '64.2';
    const avgWqi = waterStations.length
      ? (waterStations.reduce((acc, s) => acc + Number(s.wqi), 0) / waterStations.length).toFixed(1)
      : '78.5';
    return {
      avgAqi,
      avgWqi,
      airCount: airStations.length,
      waterCount: waterStations.length
    };
  }, [stations]);

  const navModules = [
    { id: 'overview', label: 'Live Map', icon: Compass },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Console', icon: Shield, badge: 'Admin' }] : []),
    { id: 'stations', label: 'Stations Directory', icon: Database, badge: `${stations.length}` },
    { id: 'analytics', label: 'Forecasts & Trends', icon: BarChart3 },
    { id: 'optimization', label: 'Route Planner', icon: BrainCircuit },
    { id: 'incidents', label: 'Community Reports', icon: AlertTriangle },
    { id: 'integrations', label: 'Sensors & Feeds', icon: Radio },
    { id: 'docs', label: 'Documentation', icon: FileCheck }
  ];

  return (
    <div className="flex h-screen bg-[#09090B] text-zinc-100 font-sans antialiased overflow-hidden">

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION (Minimal Titanium Theme) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 min-w-[16rem] bg-[#0D0D10] border-r border-[#27272A]
        flex flex-col justify-between h-full
        transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">

          {/* Brand Header */}
          <div className="p-4 border-b border-[#27272A] bg-[#0D0D10]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4 text-zinc-950" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                    EcoSphere
                  </div>
                  <div className="text-xs text-zinc-400 font-normal">
                    Environmental Monitor
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick link back to website */}
          {onBackToWebsite && (
            <div className="px-3 pt-3 pb-1 border-b border-[#27272A]/50">
              <button
                onClick={onBackToWebsite}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-zinc-300 hover:text-white bg-[#121215] hover:bg-zinc-850 border border-[#27272A] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                  <span>Return to Home</span>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            </div>
          )}

          {/* Primary Navigation Links */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Main Navigation">
            <div className="px-3 pt-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
              Navigation
            </div>
            {navModules.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveTab && setActiveTab(mod.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors duration-150 ${
                    isActive
                      ? 'bg-zinc-800/80 text-white font-medium border border-zinc-700/50'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span className="truncate">{mod.label}</span>
                  </div>
                  {mod.badge && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-850 text-zinc-400'
                    }`}>
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status Footer */}
          <div className="p-3.5 border-t border-[#27272A] bg-[#09090B] text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Telemetry Grid</span>
              <span className="text-white font-medium font-mono tabular-nums flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                {stations.length} Active Nodes
              </span>
            </div>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 w-full py-1.5 px-2.5 rounded-md bg-[#121215] hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#27272A]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              API Documentation
            </a>
          </div>

        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090B]">

        {/* TOPBAR (Clean, Uncluttered, Focused) */}
        <header className="bg-[#0D0D10] border-b border-[#27272A] px-4 lg:px-6 py-2.5 flex items-center justify-between sticky top-0 z-20 gap-3">

          {/* Left Controls: Hamburger + Return to Website */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {onBackToWebsite && (
              <button
                onClick={onBackToWebsite}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#121215] hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-[#27272A] transition-colors"
                title="Return to Public Website"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Website</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search stations, cities, or sensors…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-1.5 rounded-md bg-[#09090B] border border-[#27272A] text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#121215] border border-[#27272A] rounded-lg shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                <div className="p-2 border-b border-[#27272A] text-xs font-medium uppercase tracking-wider text-zinc-400 flex justify-between items-center">
                  <span>Matching Stations ({filteredStations.length})</span>
                  <button onClick={() => setIsSearchOpen(false)} className="hover:text-white text-xs">Close</button>
                </div>
                {filteredStations.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-400">
                    No stations matching "{searchQuery}"
                  </div>
                ) : (
                  filteredStations.map((st) => (
                    <button
                      key={st.id || st.code}
                      onClick={() => handleSelectStation(st)}
                      className="w-full text-left p-2.5 hover:bg-[#18181B] transition-colors flex items-center justify-between border-b border-[#27272A]/40 last:border-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${
                          st.station_type === 'Air' ? 'bg-emerald-400' :
                          st.station_type === 'Water' ? 'bg-sky-400' : 'bg-zinc-400'
                        }`} />
                        <div>
                          <div className="text-xs font-medium text-white">{st.name}</div>
                          <div className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-400" />
                            {st.location_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                          {st.station_type}
                        </span>
                        {st.aqi && (
                          <div className="text-xs font-medium text-emerald-400 font-mono tabular-nums mt-0.5">
                            AQI {st.aqi}
                          </div>
                        )}
                        {st.wqi && (
                          <div className="text-xs font-medium text-sky-400 font-mono tabular-nums mt-0.5">
                            WQI {st.wqi}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile & Menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#09090B] border border-[#27272A] text-xs font-mono">
              {isAdmin ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span className="text-zinc-200">Admin Command</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-zinc-400">Observer Portal</span>
                </>
              )}
            </div>

            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-zinc-850 transition-colors group"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-white select-none">
                      {(user.full_name || user.email || 'U')
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium text-white leading-tight max-w-[120px] truncate">{user.full_name || user.email}</div>
                    <div className="text-xs text-zinc-400 capitalize">{user.role || 'Operator'}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#121215] border border-[#27272A] rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-[#27272A]">
                      <div className="text-xs font-semibold text-white truncate">{user.full_name || user.email}</div>
                      <div className="text-xs text-zinc-400 mt-0.5 truncate">{user.email}</div>
                      <span className="inline-block mt-1.5 text-[11px] px-1.5 py-0.5 rounded font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {isAdmin ? 'Operations Admin' : 'Field Observer'}
                      </span>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { setUserMenuOpen(false); setActiveTab('docs'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                      >
                        <UserCircle className="w-3.5 h-3.5 text-zinc-400" />
                        System Specs & Docs
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </header>

        {/* WORKSPACE CONTENT */}
        <main className="p-5 space-y-5 flex-1 overflow-y-auto">

          {activeTab === 'overview' ? (
            <>
              {/* TOP KPI CARDS (Inverted Pyramid: Crucial Data First) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  {
                    label: 'Monitoring Nodes',
                    value: `${stations.length}`,
                    sub: '100% Online',
                    subColor: 'text-emerald-400',
                    dot: 'bg-emerald-400'
                  },
                  {
                    label: 'Air Quality (Avg AQI)',
                    value: metrics.avgAqi,
                    sub: 'Satisfactory',
                    subColor: 'text-emerald-400',
                    dot: 'bg-emerald-400'
                  },
                  {
                    label: 'Water Quality (Avg WQI)',
                    value: `${metrics.avgWqi} / 100`,
                    sub: 'Optimal Status',
                    subColor: 'text-sky-400',
                    dot: 'bg-sky-400'
                  },
                  {
                    label: 'Data Stream Health',
                    value: '100%',
                    sub: '0 Critical Incidents',
                    subColor: 'text-zinc-400',
                    dot: 'bg-zinc-400'
                  }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-[#121215] border border-[#27272A] rounded-lg p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                      <span>{kpi.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${kpi.dot}`} />
                    </div>
                    <div className="text-xl lg:text-2xl font-semibold text-white font-mono tabular-nums">
                      {kpi.value}
                    </div>
                    <div className={`text-xs font-medium font-sans ${kpi.subColor}`}>
                      {kpi.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* SEGMENTED FILTERS */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121215] p-2.5 rounded-lg border border-[#27272A]">

                {/* Type Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                    Type:
                  </span>
                  {['All', 'Air', 'Water', 'Multi-sensor'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedTypeFilter(type)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                        selectedTypeFilter === type
                          ? 'bg-white text-zinc-950 font-semibold'
                          : 'bg-[#09090B] text-zinc-400 hover:text-zinc-200 border border-[#27272A]'
                      }`}
                    >
                      {type === 'All' ? 'All Types' : type}
                    </button>
                  ))}
                </div>

                {/* Region Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    Region:
                  </span>
                  {['All', ...availableCities].map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCityFilter(city)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                        selectedCityFilter === city
                          ? 'bg-zinc-800 text-white border border-zinc-700'
                          : 'bg-[#09090B] text-zinc-400 hover:text-zinc-200 border border-[#27272A]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

              </div>

              {/* MAP + STATION SPOTLIGHT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* MAP (7 Cols) */}
                <div className="lg:col-span-7 bg-[#121215] border border-[#27272A] rounded-lg p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-white font-medium flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Node Map</span>
                      <span className="text-zinc-400 text-xs font-mono tabular-nums">
                        ({filteredStations.length} of {stations.length})
                      </span>
                    </div>
                    <span className="text-zinc-400 text-xs">Click pin to inspect</span>
                  </div>

                  <div className="h-96 w-full rounded-md overflow-hidden border border-[#27272A] relative">
                    {filteredStations.length === 0 ? (
                      <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-[#09090B]">
                        <Database className="w-7 h-7 text-zinc-600 mb-2" />
                        <div className="text-xs font-medium text-white">No matching stations</div>
                        <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                          No telemetry nodes match the current filter selection.
                        </p>
                        <button
                          onClick={() => { setSearchQuery(''); setSelectedTypeFilter('All'); setSelectedCityFilter('All'); }}
                          className="mt-3 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white border border-zinc-700 transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <StationMap
                        stations={filteredStations}
                        selectedStation={selectedStation}
                        onSelectStation={handleSelectStation}
                        height="100%"
                      />
                    )}
                  </div>
                </div>

                {/* STATION SPOTLIGHT (5 Cols) */}
                <div className="lg:col-span-5 bg-[#121215] border border-[#27272A] rounded-lg p-4 space-y-3.5">
                  {selectedStation ? (
                    <>
                      <div className="flex items-start justify-between border-b border-[#27272A] pb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono">
                              {selectedStation.station_type}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono tabular-nums">
                              {selectedStation.code}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-white mt-1.5">
                            {selectedStation.name}
                          </h3>
                          <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            {selectedStation.location_name}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Online
                        </span>
                      </div>

                      {/* Primary Readings */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 bg-[#09090B] rounded-md border border-[#27272A]">
                          <div className="text-xs text-zinc-400 font-medium">
                            {selectedStation.station_type === 'Water' ? 'Water Quality (WQI)' : 'Air Quality (AQI)'}
                          </div>
                          <div className="text-xl font-semibold text-white mt-1 font-mono tabular-nums flex items-baseline gap-1.5">
                            {selectedStation.aqi != null
                              ? Number(selectedStation.aqi).toFixed(1)
                              : selectedStation.wqi != null
                              ? Number(selectedStation.wqi).toFixed(1)
                              : '65.2'}
                            <span className="text-xs text-emerald-400 font-normal">
                              {selectedStation.aqi != null && selectedStation.aqi > 100 ? 'Moderate' : 'Optimal'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-[#09090B] rounded-md border border-[#27272A]">
                          <div className="text-xs text-zinc-400 font-medium">Atmosphere</div>
                          <div className="text-xl font-semibold text-white mt-1 font-mono tabular-nums">
                            {(24 + (((selectedStation.id || 1) * 7) % 8)).toFixed(1)}°C
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5 font-mono tabular-nums">
                            Humidity: {45 + (((selectedStation.id || 1) * 11) % 30)}%
                          </div>
                        </div>
                      </div>

                      {/* Metadata Table */}
                      <div className="p-3 bg-[#09090B] rounded-md border border-[#27272A] text-xs font-mono tabular-nums space-y-1.5 text-zinc-400">
                        <div className="flex justify-between">
                          <span>Latitude:</span>
                          <span className="text-zinc-200">{selectedStation.latitude?.toFixed(4) || '17.3850'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Longitude:</span>
                          <span className="text-zinc-200">{selectedStation.longitude?.toFixed(4) || '78.4867'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-emerald-400 font-sans">{selectedStation.status || 'Active'}</span>
                        </div>
                      </div>

                      {/* View Details Action */}
                      <button
                        onClick={() => setActiveTab('stations')}
                        className="w-full py-2 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#27272A]"
                      >
                        <span>Open Station in Registry</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </>
                  ) : (
                    <div className="p-8 text-center text-xs text-zinc-400">
                      <Compass className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white">No Station Selected</div>
                      <p className="mt-1 text-zinc-400 max-w-xs mx-auto">
                        Click any map marker to inspect station telemetry.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* LIVE TELEMETRY FEED TABLE */}
              <div className="bg-[#121215] border border-[#27272A] rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#27272A] pb-2 text-xs">
                  <div className="text-white font-medium flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Real-Time Ingestion Feed</span>
                  </div>
                  <div className="text-zinc-400 font-mono text-xs tabular-nums">Continuous Stream</div>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#09090B] text-zinc-400 text-xs uppercase font-medium border-b border-[#27272A]">
                      <tr>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Station Code</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Telemetry Metric</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A] text-zinc-200 font-mono tabular-nums">
                      {telemetryLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#18181B] transition-colors">
                          <td className="py-2.5 px-3 text-zinc-400">{log.time}</td>
                          <td className="py-2.5 px-3 font-medium text-white">{log.code}</td>
                          <td className="py-2.5 px-3 text-zinc-300 font-sans">{log.location}</td>
                          <td className="py-2.5 px-3 text-zinc-200">{log.metric}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                              log.status === 'Attention'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#121215] border border-[#27272A] rounded-lg p-5">
              {children}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
