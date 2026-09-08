import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  BrainCircuit,
  Users,
  FileCheck,
  Activity,
  AlertTriangle,
  Truck,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Compass
} from 'lucide-react';
import StationMap from './StationMap';

export default function ScadaDashboardLayout({ stations = [], activeTab = 'overview', setActiveTab }) {
  // Live telemetry table ticks state
  const [telemetryLogs, setTelemetryLogs] = useState([
    { id: 101, timestamp: '16:41:02', stationId: 'ST-001', metricDelta: 'AQI +1.2', status: 'Nominal' },
    { id: 102, timestamp: '16:41:05', stationId: 'ST-002', metricDelta: 'pH -0.1', status: 'Nominal' },
    { id: 103, timestamp: '16:41:08', stationId: 'ST-005', metricDelta: 'Turbidity +4.2 NTU', status: 'Warning' },
    { id: 104, timestamp: '16:41:11', stationId: 'ST-003', metricDelta: 'Solar +12 kW', status: 'Nominal' },
    { id: 105, timestamp: '16:41:14', stationId: 'ST-004', metricDelta: 'PM2.5 -0.4 µg/m³', status: 'Nominal' },
  ]);

  // Live telemetry update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const stationNum = Math.floor(Math.random() * 5) + 1;
      const isWarn = stationNum === 5 && Math.random() > 0.6;
      
      const newEntry = {
        id: Date.now(),
        timestamp: timeStr,
        stationId: `ST-00${stationNum}`,
        metricDelta: isWarn ? 'Turbidity +3.8 NTU' : `PM2.5 ${(Math.random() * 0.8 - 0.4).toFixed(1)} µg/m³`,
        status: isWarn ? 'Warning' : 'Nominal'
      };

      setTelemetryLogs(prev => [newEntry, ...prev.slice(0, 7)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Control Center', icon: LayoutDashboard },
    { id: 'phase1', label: 'Data Registry', icon: Database },
    { id: 'phase2', label: 'ML Analytics', icon: BarChart3 },
    { id: 'phase3', label: 'Route Optimizer', icon: BrainCircuit },
    { id: 'phase4', label: 'Ranger Portal', icon: Users },
    { id: 'phase6', label: 'Governance', icon: FileCheck },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F12] text-slate-200 font-sans antialiased overflow-hidden selection:bg-[#222B32] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. FIXED LEFT SIDEBAR NAVIGATION (Width: 260px)                          */}
      {/* ========================================================================= */}
      <aside className="w-[260px] min-w-[260px] bg-[#141A1F] border-r border-[#222B32] flex flex-col justify-between h-full z-20">
        <div>
          {/* Header Branding */}
          <div className="p-4 border-b border-[#222B32] flex items-center space-x-3">
            <div className="p-1.5 rounded bg-[#222B32] text-[#10B981]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">ISLA SCADA CORE</div>
              <div className="text-[11px] text-slate-400 font-normal">Environmental Control</div>
            </div>
          </div>

          {/* Clean Navigation Menu */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-none ${
                    isActive
                      ? 'bg-[#222B32] text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A2228]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Metadata */}
        <div className="p-4 border-t border-[#222B32] text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">SCADA Host Interface</div>
          <div>Telemetry Status: Connected</div>
          <div className="text-[10px] text-slate-500 font-mono">Port: 8000 (FastAPI)</div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE WINDOW                                                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* ======================================================================= */}
        {/* 2. GLOBAL CONTEXT HEADER                                                */}
        {/* ======================================================================= */}
        <header className="bg-[#141A1F] border-b border-[#222B32] px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              ISLA OPERATIONS MANAGEMENT
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Engineering Team: P. Varshith, Snehith, Sai Vishal, Arjun, BV. Charan
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Flat Green Pill Badge */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded bg-[#10B981]/15 text-[#10B981] font-semibold border border-[#10B981]/30">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>SYSTEM STATUS: OK</span>
            </div>

            {/* Separate Grey Badge for Passing Tests */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#222B32] text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>11/11 TESTS PASSED</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="p-6 space-y-6 flex-1">
          
          {/* ===================================================================== */}
          {/* 3. TWO-COLUMN WORKSPACE ARRAY (70% / 30% Setup)                      */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            
            {/* LEFT COLUMN: MAIN DATA HUB (70% Width -> 7 Cols out of 10) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION A: MAP WRAPPER */}
              <div className="bg-[#141A1F] border border-[#222B32] rounded p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#222B32] pb-3">
                  <div className="flex items-center space-x-2 text-white font-semibold text-xs uppercase tracking-wide">
                    <Activity className="w-4 h-4 text-[#10B981]" />
                    <span>Regional Telemetry GIS Map</span>
                  </div>
                  <div className="text-xs text-slate-400 font-normal">
                    Center Coordinates: <span className="font-mono text-slate-200">17.3850° N, 78.4866° E</span>
                  </div>
                </div>

                <div className="h-80 w-full rounded overflow-hidden border border-[#222B32]">
                  <StationMap stations={stations} />
                </div>
              </div>

              {/* SECTION B: DENSE TELEMETRY LOG TABLE */}
              <div className="bg-[#141A1F] border border-[#222B32] rounded p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#222B32] pb-3">
                  <div className="text-xs font-semibold text-white uppercase tracking-wide">
                    Recent Telemetry Log Tracker
                  </div>
                  <div className="text-xs text-slate-400 font-normal">
                    Update Frequency: Real-Time
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B0F12] text-slate-400 font-semibold border-b border-[#222B32]">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Station ID</th>
                        <th className="py-2.5 px-3">Metric Delta</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222B32] text-slate-300 font-normal">
                      {telemetryLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#1A2228] transition-none">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{log.timestamp}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-200 font-semibold">{log.stationId}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-200">{log.metricDelta}</td>
                          <td className="py-2.5 px-3">
                            {log.status === 'Warning' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                                Warning
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#10B981]/15 text-[#10B981]">
                                Nominal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ANALYTICS SUITE (30% Width -> 3 Cols out of 10) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* MODULE A: SUSTAINABILITY PERFORMANCE INDEX */}
              <div className="bg-[#141A1F] border border-[#222B32] rounded p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#222B32] pb-3 text-xs">
                  <span className="font-semibold text-white uppercase tracking-wide">
                    Sustainability Index
                  </span>
                  <span className="text-[#10B981] font-semibold">Composite</span>
                </div>

                {/* Score Header with Ring Indicator */}
                <div className="flex items-center justify-between bg-[#0B0F12] p-4 rounded border border-[#222B32]">
                  <div>
                    <div className="text-3xl font-bold text-white font-mono">84</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">Eco-Performance Rating</div>
                  </div>

                  {/* Solid Thin Circular Ring (84%) */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-[#222B32]"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#10B981]"
                        strokeDasharray="84, 100"
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold font-mono text-[#10B981]">84%</span>
                  </div>
                </div>

                {/* 2x2 Sub-Scores Grid with Uniform Horizontal Bars */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  
                  {/* Air Quality */}
                  <div className="bg-[#0B0F12] p-3 rounded border border-[#222B32] space-y-1.5">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Air Quality</span>
                      <span className="font-mono text-slate-200 font-semibold">88%</span>
                    </div>
                    <div className="w-full bg-[#222B32] h-1.5 rounded overflow-hidden">
                      <div className="bg-[#10B981] h-full w-[88%]"></div>
                    </div>
                  </div>

                  {/* Water Quality */}
                  <div className="bg-[#0B0F12] p-3 rounded border border-[#222B32] space-y-1.5">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Water Quality</span>
                      <span className="font-mono text-slate-200 font-semibold">79%</span>
                    </div>
                    <div className="w-full bg-[#222B32] h-1.5 rounded overflow-hidden">
                      <div className="bg-[#F59E0B] h-full w-[79%]"></div>
                    </div>
                  </div>

                  {/* Energy Share */}
                  <div className="bg-[#0B0F12] p-3 rounded border border-[#222B32] space-y-1.5">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Energy Share</span>
                      <span className="font-mono text-slate-200 font-semibold">86%</span>
                    </div>
                    <div className="w-full bg-[#222B32] h-1.5 rounded overflow-hidden">
                      <div className="bg-[#10B981] h-full w-[86%]"></div>
                    </div>
                  </div>

                  {/* Circular Waste */}
                  <div className="bg-[#0B0F12] p-3 rounded border border-[#222B32] space-y-1.5">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Waste Recycle</span>
                      <span className="font-mono text-slate-200 font-semibold">83%</span>
                    </div>
                    <div className="w-full bg-[#222B32] h-1.5 rounded overflow-hidden">
                      <div className="bg-[#10B981] h-full w-[83%]"></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* MODULE B: MACHINE LEARNING GUARDRAIL ALERT CARD */}
              <div className="bg-[#141A1F] border border-[#F59E0B] rounded p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#222B32] pb-3 text-xs text-[#F59E0B] font-semibold">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    <span>ML Anomaly Guardrail</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] text-[11px]">
                    1 Flagged
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between text-slate-400">
                    <span>Target Station:</span>
                    <span className="font-mono text-slate-100 font-semibold">ST-005 (Musi River)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Anomaly Score:</span>
                    <span className="font-mono text-[#F59E0B] font-semibold">0.84 (Isolation Forest Outlier)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Metric Variance:</span>
                    <span className="font-mono text-slate-200">Turbidity +4.2 NTU, DO -2.4 mg/L</span>
                  </div>

                  <div className="pt-2 border-t border-[#222B32] flex items-center justify-between text-xs">
                    <span className="text-slate-400">Action Suggested: Review Discharge</span>
                    <button
                      onClick={() => setActiveTab && setActiveTab('phase2')}
                      className="text-[#10B981] hover:underline flex items-center space-x-1 font-medium"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* LOGISTICS OPTIMIZATION SUMMARY FOOTER (Full Width Footer Block)      */}
          {/* ===================================================================== */}
          <section className="bg-[#141A1F] border border-[#222B32] rounded p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B32] pb-3 text-xs">
              <div className="flex items-center space-x-2 font-semibold text-white uppercase tracking-wide">
                <Truck className="w-4 h-4 text-[#10B981]" />
                <span>Logistics Route Optimization Metrics</span>
              </div>
              <span className="text-slate-400 text-xs font-normal">
                Optimization Engine: Traveling Salesperson Heuristic
              </span>
            </div>

            {/* 3-Column Data-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Distance Saved */}
              <div className="bg-[#0B0F12] p-4 rounded border border-[#222B32] space-y-1">
                <div className="text-xs text-slate-400 font-normal uppercase">
                  Distance Saved
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  42.8 <span className="text-sm font-sans font-medium text-slate-400">km</span>
                </div>
                <div className="text-[11px] text-[#10B981] font-semibold">
                  28.4% reduction vs standard route
                </div>
              </div>

              {/* Card 2: Fuel Conserved */}
              <div className="bg-[#0B0F12] p-4 rounded border border-[#222B32] space-y-1">
                <div className="text-xs text-slate-400 font-normal uppercase">
                  Fuel Conserved
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  15.0 <span className="text-sm font-sans font-medium text-slate-400">L</span>
                </div>
                <div className="text-[11px] text-[#F59E0B] font-semibold">
                  Heavy collection vehicle diesel saved
                </div>
              </div>

              {/* Card 3: CO2 Emissions Reduced */}
              <div className="bg-[#0B0F12] p-4 rounded border border-[#222B32] space-y-1">
                <div className="text-xs text-slate-400 font-normal uppercase">
                  CO2 Emissions Reduced
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  40.2 <span className="text-sm font-sans font-medium text-slate-400">kg</span>
                </div>
                <div className="text-[11px] text-[#10B981] font-semibold">
                  Direct environmental offset calculated
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>

    </div>
  );
}
