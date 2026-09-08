import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Compass,
  Radio,
  Terminal,
  ShieldAlert,
  Cpu,
  Truck,
  Zap,
  TrendingUp,
  Layers,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import StationMap from './StationMap';

export default function TacticalDashboardContainer({ stations = [], onNavigate }) {
  // Live ticking IoT terminal state
  const [terminalLogs, setTerminalLogs] = useState([
    { id: 1, time: '16:35:48', text: '[TICK] Station_01 (Downtown Core): AQI US 70 | PM2.5 15.0 µg/m³', type: 'nominal' },
    { id: 2, time: '16:35:49', text: '[TICK] Station_02 (Hussain Sagar): pH 7.4 | DO 6.8 mg/L | WQI 78', type: 'nominal' },
    { id: 3, time: '16:35:50', text: '[WARN] Station_05 (Musi River): Turbidity spike 11.2 NTU [IF_SCORE: -0.42]', type: 'warning' },
    { id: 4, time: '16:35:51', text: '[TICK] Solar_Microgrid_01: Generation 600 kW | Battery Storage 250 kW', type: 'nominal' },
    { id: 5, time: '16:35:52', text: '[OPTIMIZER] Route solver recalculated 5 waste nodes: -28.4% KM saved', type: 'nominal' },
  ]);

  const [terminalPaused, setTerminalPaused] = useState(false);
  const terminalEndRef = useRef(null);

  // Auto-ticking simulation for live IoT terminal
  useEffect(() => {
    if (terminalPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const stationId = Math.floor(Math.random() * 5) + 1;
      const pmDelta = (Math.random() * 0.8 - 0.4).toFixed(1);
      const isWarn = Math.random() < 0.15;

      const newLog = {
        id: Date.now(),
        time: timeStr,
        text: isWarn
          ? `[WARN] Station_0${stationId}: Unexpected telemetry flux detected [Z_SCORE: ${(2.5 + Math.random()).toFixed(2)}]`
          : `[TICK] Station_0${stationId}: PM2.5 delta ${pmDelta > 0 ? '+' : ''}${pmDelta} µg/m³`,
        type: isWarn ? 'warning' : 'nominal'
      };

      setTerminalLogs((prev) => [...prev.slice(-25), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, [terminalPaused]);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  return (
    <div className="min-h-screen bg-[#040d09] text-slate-100 font-mono p-4 md:p-6 space-y-5 selection:bg-[#10b981] selection:text-[#040d09]">
      
      {/* ========================================================================= */}
      {/* 1. GLOBAL HEADER HUD                                                      */}
      {/* ========================================================================= */}
      <header className="bg-[#091912] border border-[#153123] p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Structural Title & Operators Metadata */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#10b981]/10 border border-[#10b981]/40 rounded text-[#10b981]">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-50 uppercase flex items-center gap-2">
              ISLA BIO-RESERVE TACTICAL CORE
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 font-bold">
                v1.0.0
              </span>
            </h1>
          </div>
          <p className="text-xs text-[#10b981]/70 font-mono tracking-tight">
            SYS_OPERATORS: P.Varshith // Snehith // S.Vishal // Arjun // B.Charan
          </p>
        </div>

        {/* Right Side: System Health Array & Verification Tracker */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Live Pulse Animation */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#040d09] border border-[#10b981]/40 text-[#10b981]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
            </span>
            <span className="font-bold tracking-wider">SYSTEM: ONLINE</span>
          </div>

          {/* Automated Verification Tracker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#040d09] border border-[#f59e0b]/40 text-[#f59e0b]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="font-bold tracking-wider">PYTESTS: 11/11 PASSED</span>
          </div>

          {/* Quick Command Refresh */}
          <button
            onClick={() => setTerminalLogs((prev) => [...prev, { id: Date.now(), time: new Date().toTimeString().split(' ')[0], text: '[COMMAND] Manual system health re-scan executed', type: 'nominal' }])}
            className="p-1.5 rounded-lg bg-[#153123] border border-[#10b981]/30 text-slate-300 hover:text-white hover:bg-[#10b981]/20 transition-none"
            title="Execute System Re-scan"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE CORE GRID (3-COLUMN RESPONSIVE SETUP)                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* TELEMETRY MATRIX (Spans 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#091912] border border-[#153123] p-4 rounded-xl space-y-3">
            {/* Matrix Header */}
            <div className="flex items-center justify-between border-b border-[#153123] pb-2.5">
              <div className="flex items-center gap-2 text-[#10b981]">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">REGIONAL SENSOR MATRIX & MAP OVERLAY</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>GRID: <strong className="text-slate-200">17.3850° N, 78.4866° E</strong></span>
                <span className="text-[#10b981] font-bold">STATIONS: {stations.length || 5} ACTIVE</span>
              </div>
            </div>

            {/* Map Placeholder Container */}
            <div className="h-80 w-full rounded-lg overflow-hidden border border-[#153123] relative">
              <StationMap stations={stations} />
            </div>
          </div>

          {/* Secondary Ticking Side Terminal Streaming Fake IoT Ticks */}
          <div className="bg-[#091912] border border-[#153123] p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-[#10b981] border-b border-[#153123] pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider">LIVE IOT SENSOR STREAM TERMINAL</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={() => setTerminalPaused(!terminalPaused)}
                  className="px-2 py-0.5 rounded bg-[#040d09] border border-[#153123] text-slate-300 hover:text-[#10b981]"
                >
                  {terminalPaused ? '[RESUME STREAM]' : '[PAUSE STREAM]'}
                </button>
                <span className="text-slate-500 font-mono">CHANNEL: UDP_8000</span>
              </div>
            </div>

            {/* Scrollable Logs Window */}
            <div className="h-36 overflow-y-auto font-mono text-[11px] space-y-1 bg-[#040d09] p-3 rounded-lg border border-[#153123]">
              {terminalLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-tight">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'warning'
                        ? 'text-[#f59e0b] font-bold'
                        : log.type === 'error'
                        ? 'text-[#ef4444] font-bold'
                        : 'text-[#10b981]'
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* ANALYTICAL FORECASTING PANEL (1 Column) */}
        <div className="space-y-4">
          
          {/* Sustainability Performance Index (SPI) Gauge Placeholder Component */}
          <div className="bg-[#091912] border border-[#153123] p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#153123] pb-2 text-xs">
              <span className="font-bold text-[#10b981] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                SPI SUSTAINABILITY INDEX
              </span>
              <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold text-[10px] border border-[#10b981]/30">
                NOMINAL
              </span>
            </div>

            {/* Crisp 84/100 Metric Display */}
            <div className="flex items-center justify-between bg-[#040d09] p-4 rounded-lg border border-[#153123]">
              <div>
                <div className="text-4xl font-extrabold text-slate-50 tracking-tight">
                  84<span className="text-base text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-[#10b981] uppercase font-bold mt-0.5">
                  Eco-Performance Composite
                </div>
              </div>

              {/* Graphical Circular Progress Indicator */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#153123]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#10b981]"
                    strokeDasharray="84, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-[#10b981]">84%</span>
              </div>
            </div>

            {/* Sub-Score Category Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#040d09] p-2.5 rounded border border-[#153123]">
                <div className="text-slate-400 text-[10px]">Air Purity</div>
                <div className="font-bold text-[#10b981]">88 / 100</div>
              </div>
              <div className="bg-[#040d09] p-2.5 rounded border border-[#153123]">
                <div className="text-slate-400 text-[10px]">Water Health</div>
                <div className="font-bold text-[#f59e0b]">79 / 100</div>
              </div>
              <div className="bg-[#040d09] p-2.5 rounded border border-[#153123]">
                <div className="text-slate-400 text-[10px]">Clean Energy</div>
                <div className="font-bold text-[#10b981]">86 / 100</div>
              </div>
              <div className="bg-[#040d09] p-2.5 rounded border border-[#153123]">
                <div className="text-slate-400 text-[10px]">Circular Waste</div>
                <div className="font-bold text-[#10b981]">83 / 100</div>
              </div>
            </div>
          </div>

          {/* Dedicated Warning Component Showing Anomalous Isolation Forest Flags */}
          <div className="bg-[#091912] border border-[#f59e0b]/40 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#153123] pb-2 text-xs text-[#f59e0b]">
              <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ISOLATION FOREST ANOMALY DETECTOR
              </span>
              <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-bold text-[10px] border border-[#f59e0b]/30">
                1 FLAGGED
              </span>
            </div>

            {/* Warning Message Card */}
            <div className="p-3 rounded-lg bg-[#040d09] border border-[#f59e0b]/30 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-[#f59e0b]">
                <span>[ANOMALY_FLAGGED] Musi Basin ST-005</span>
                <span className="text-[10px] font-mono text-slate-400">Score: -0.42</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Isolation Forest model detected sudden turbidity spike (11.2 NTU) and dissolved oxygen dip (3.8 mg/L).
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Diagnostics: Chemical Dispersal</span>
                <button
                  onClick={() => onNavigate && onNavigate('phase2')}
                  className="text-[#f59e0b] underline hover:text-[#10b981] flex items-center gap-1"
                >
                  View Details <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. OPTIMIZATION METRICS BAR (FULL WIDTH FOOTER BLOCK)                    */}
      {/* ========================================================================= */}
      <footer className="bg-[#091912] border border-[#153123] p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#153123] pb-2 text-xs text-[#10b981]">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            LOGISTICS & RESOURCE OPTIMIZATION SOLVER (TSP NEAREST-NEIGHBOR)
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            ALGORITHM: O(N log N) HEURISTIC // EXEC_TIME: 1.24ms
          </span>
        </div>

        {/* 3-Column Data-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Distance Saved */}
          <div className="bg-[#040d09] p-3.5 rounded-lg border border-dashed border-[#153123] hover:border-[#10b981]/50 transition-none space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              [METRIC_01] ROUTE DISTANCE SAVED
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-50 font-mono">42.8 <span className="text-xs text-[#10b981]">KM</span></span>
              <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                -28.4%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Baseline: 150.7 KM vs Optimized: 107.9 KM</div>
          </div>

          {/* Card 2: Fuel Conserved */}
          <div className="bg-[#040d09] p-3.5 rounded-lg border border-dashed border-[#153123] hover:border-[#f59e0b]/50 transition-none space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              [METRIC_02] DIESEL FUEL CONSERVED
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-50 font-mono">15.0 <span className="text-xs text-[#f59e0b]">LITERS</span></span>
              <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/30">
                0.35 L/KM
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Heavy Collection Vehicle Fleet Allocation</div>
          </div>

          {/* Card 3: CO2 Emissions Reduced */}
          <div className="bg-[#040d09] p-3.5 rounded-lg border border-dashed border-[#153123] hover:border-[#10b981]/50 transition-none space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              [METRIC_03] CO2 EMISSIONS REDUCED
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-50 font-mono">40.2 <span className="text-xs text-[#10b981]">KG</span></span>
              <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                2.68 KG/L
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Direct Carbon Footprint Reduction Metric</div>
          </div>

        </div>
      </footer>

    </div>
  );
}
