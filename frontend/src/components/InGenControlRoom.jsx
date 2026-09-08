import React, { useState, useEffect } from 'react';
import {
  Activity,
  Compass,
  Database,
  BarChart3,
  BrainCircuit,
  Users,
  FileCheck,
  AlertTriangle,
  Truck,
  TrendingUp,
  CheckCircle2,
  Terminal,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import StationMap from './StationMap';

export default function InGenControlRoom({ stations = [], activeTab = 'overview', setActiveTab, children }) {
  // Live Telemetry Logs
  const [telemetryRows, setTelemetryRows] = useState([
    { id: 201, timestamp: '16:44:02', stationId: 'ST-001', metricDelta: 'AQI +1.2', status: 'NOMINAL' },
    { id: 202, timestamp: '16:44:05', stationId: 'ST-002', metricDelta: 'pH -0.1', status: 'NOMINAL' },
    { id: 203, timestamp: '16:44:08', stationId: 'ST-005', metricDelta: 'TURBIDITY +4.2 NTU', status: 'WARNING' },
    { id: 204, timestamp: '16:44:11', stationId: 'ST-003', metricDelta: 'SOLAR +12.0 KW', status: 'NOMINAL' },
    { id: 205, timestamp: '16:44:14', stationId: 'ST-004', metricDelta: 'PM2.5 -0.4 UG/M3', status: 'NOMINAL' },
  ]);

  // Live telemetry stream generator
  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toTimeString().split(' ')[0];
      const stationNum = Math.floor(Math.random() * 5) + 1;
      const isThreat = stationNum === 5 && Math.random() > 0.65;

      const newRow = {
        id: Date.now(),
        timestamp: timeStr,
        stationId: `ST-00${stationNum}`,
        metricDelta: isThreat ? 'TURBIDITY +3.8 NTU' : `PM2.5 ${(Math.random() * 0.8 - 0.4).toFixed(1)} UG/M3`,
        status: isThreat ? 'WARNING' : 'NOMINAL'
      };

      setTelemetryRows(prev => [newRow, ...prev.slice(0, 6)]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const commandModules = [
    { id: 'overview', label: '01 // CORE_CONTROL', icon: Compass },
    { id: 'phase1', label: '02 // DATA_REGISTRY', icon: Database },
    { id: 'phase2', label: '03 // ML_ANALYTICS', icon: BarChart3 },
    { id: 'phase3', label: '04 // ROUTE_SOLVER', icon: BrainCircuit },
    { id: 'phase4', label: '05 // FIELD_PORTAL', icon: Users },
    { id: 'phase6', label: '06 // LOGS_GOVERNANCE', icon: FileCheck },
  ];

  return (
    <div className="flex h-screen bg-[#090E0B] text-white font-mono antialiased overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. UNIFIED LEFT COMMAND DOCK (Width: 240px)                               */}
      {/* ========================================================================= */}
      <aside className="w-[240px] min-w-[240px] bg-[#111813] border-r border-[#1D2A22] flex flex-col justify-between h-full z-30">
        <div>
          {/* InGen Header Brand */}
          <div className="p-4 border-b border-[#1D2A22] space-y-1">
            <div className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#10B981]"></span>
              INGEN SYSTEM
            </div>
            <div className="text-[10px] text-[#8E9A92]">CONTROL DOCK v3.12</div>
          </div>

          {/* Module List */}
          <nav className="p-2 space-y-1">
            {commandModules.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab && setActiveTab(mod.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-none text-[11px] font-bold transition-none border-l-2 ${
                    isActive
                      ? 'bg-[#1D2A22] text-white border-[#10B981]'
                      : 'text-[#8E9A92] hover:text-white hover:bg-[#162019] border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#10B981]' : 'text-[#8E9A92]'}`} />
                  <span className="tracking-tight">{mod.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Hardware Info */}
        <div className="p-3.5 border-t border-[#1D2A22] text-[10px] text-[#8E9A92] space-y-0.5">
          <div>HOST: INGEN_SRV_01</div>
          <div>NET: UDP_8000_ACTIVE</div>
          <div className="text-white">STATUS: NOMINAL</div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN UNIFIED DASHBOARD WINDOW                                             */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* ======================================================================= */}
        {/* 2. MINIMALIST GRID HEADER                                               */}
        {/* ======================================================================= */}
        <header className="bg-[#111813] border-b border-[#1D2A22] px-5 py-3 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider uppercase">
              INGEN ENVIRONMENTAL CORE v3.12
            </h1>
            <p className="text-[11px] text-[#8E9A92] font-normal mt-0.5">
              SYS_ENG: Varshith, Snehith, Vishal, Arjun, Charan
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            {/* Status Nominal Accent */}
            <div className="px-2.5 py-1 bg-[#111813] border border-[#1D2A22] text-[#10B981] font-bold">
              SYS_STATUS: NOMINAL
            </div>

            {/* Pytest Verification */}
            <div className="px-2.5 py-1 bg-[#111813] border border-[#1D2A22] text-[#8E9A92] font-bold">
              PYTESTS: 11/11 OK
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEWPORT */}
        <main className="p-5 space-y-5 flex-1">
          
          {activeTab === 'overview' ? (
            <>
              {/* =================================================================== */}
              {/* 3. TWO-COLUMN WORKSPACE GRID (70% / 30% Setup)                      */}
              {/* =================================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
                
                {/* PRIMARY TELEMETRY COLUMN (70% Width Layout -> 7 Cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* SECTION A: GEOSPATIAL MAP GRID */}
                  <div className="bg-[#111813] border border-[#1D2A22] rounded-none p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-[#1D2A22] pb-2 text-[11px]">
                      <div className="text-[#8E9A92] font-bold uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-[#10B981]" />
                        GEOSPATIAL TRACKING MATRIX
                      </div>
                      <div className="text-[#8E9A92]">
                        GRID_CENTER: <span className="text-white">17.3850° N, 78.4866° E</span>
                      </div>
                    </div>

                    <div className="h-80 w-full rounded-none overflow-hidden border border-[#1D2A22]">
                      <StationMap stations={stations} />
                    </div>
                  </div>

                  {/* SECTION B: DENSE TABULAR STREAMS */}
                  <div className="bg-[#111813] border border-[#1D2A22] rounded-none p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-[#1D2A22] pb-2 text-[11px]">
                      <div className="text-[#8E9A92] font-bold uppercase tracking-wider">
                        TELEMETRY STREAM LOGS
                      </div>
                      <div className="text-[#8E9A92]">RATE: REAL_TIME</div>
                    </div>

                    <div className="overflow-x-auto text-[11px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#090E0B] text-[#8E9A92] uppercase font-bold border-b border-[#1D2A22]">
                          <tr>
                            <th className="py-2 px-3 border-r border-[#1D2A22]">TIMESTAMP</th>
                            <th className="py-2 px-3 border-r border-[#1D2A22]">STATION_ID</th>
                            <th className="py-2 px-3 border-r border-[#1D2A22]">DELTA_METRIC</th>
                            <th className="py-2 px-3">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1D2A22] text-white">
                          {telemetryRows.map((row) => (
                            <tr key={row.id} className="hover:bg-[#162019] transition-none">
                              <td className="py-2 px-3 text-[#8E9A92] border-r border-[#1D2A22]">{row.timestamp}</td>
                              <td className="py-2 px-3 font-bold border-r border-[#1D2A22]">{row.stationId}</td>
                              <td className="py-2 px-3 border-r border-[#1D2A22]">{row.metricDelta}</td>
                              <td className="py-2 px-3 font-bold">
                                {row.status === 'WARNING' ? (
                                  <span className="text-[#E11D48] bg-[#E11D48]/10 px-1.5 py-0.5 border border-[#E11D48]/30">
                                    WARNING
                                  </span>
                                ) : (
                                  <span className="text-[#10B981]">
                                    NOMINAL
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

                {/* OPERATIONS MANAGEMENT COLUMN (30% Width Layout -> 3 Cols) */}
                <div className="lg:col-span-3 space-y-5">
                  
                  {/* SECTION A: PERFORMANCE INDEXES */}
                  <div className="bg-[#111813] border border-[#1D2A22] rounded-none p-3 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#1D2A22] pb-2 text-[11px]">
                      <span className="text-[#8E9A92] font-bold uppercase tracking-wider">
                        PERFORMANCE INDEX
                      </span>
                      <span className="text-[#10B981] font-bold">84%</span>
                    </div>

                    <div className="p-3 bg-[#090E0B] border border-[#1D2A22] flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-white">84</div>
                        <div className="text-[10px] text-[#8E9A92] font-bold uppercase">OVERALL COMPOSITE</div>
                      </div>
                      <div className="w-10 h-10 border-2 border-[#10B981] flex items-center justify-center text-xs font-bold text-[#10B981]">
                        84%
                      </div>
                    </div>

                    {/* Sub-Metrics Track Meters */}
                    <div className="space-y-2 text-[10px]">
                      {[
                        { label: 'AIR_PURITY', score: 88, color: '#10B981' },
                        { label: 'WATER_HEALTH', score: 79, color: '#E11D48' },
                        { label: 'CLEAN_ENERGY', score: 86, color: '#10B981' },
                        { label: 'CIRCULAR_WASTE', score: 83, color: '#10B981' },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[#8E9A92]">
                            <span>{item.label}</span>
                            <span className="text-white font-bold">{item.score}%</span>
                          </div>
                          <div className="w-full bg-[#090E0B] h-1.5 border border-[#1D2A22]">
                            <div
                              className="h-full"
                              style={{ width: `${item.score}%`, backgroundColor: item.color }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION B: ISOLATION FOREST MATRIX (1px Solid Crimson Border) */}
                  <div className="bg-[#111813] border border-[#E11D48] rounded-none p-3 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#1D2A22] pb-2 text-[11px] text-[#E11D48]">
                      <span className="font-bold uppercase tracking-wider">
                        WARN // ML_OUTLIER_DETECTED
                      </span>
                      <span className="px-1.5 py-0.2 bg-[#E11D48]/10 text-[#E11D48] text-[10px] border border-[#E11D48]/40">
                        1 FLAGGED
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#090E0B] border border-[#1D2A22] space-y-1 text-[11px] text-[#8E9A92]">
                      <div>STATION_ID: <span className="text-white font-bold">ST-005 (Musi River)</span></div>
                      <div>ANOMALY_SCORE: <span className="text-[#E11D48] font-bold">-0.42</span></div>
                      <div>VARIANCE: <span className="text-white">Turbidity +4.2 NTU, DO -2.4 mg/L</span></div>
                    </div>

                    <button
                      onClick={() => setActiveTab && setActiveTab('phase2')}
                      className="w-full py-1.5 bg-[#090E0B] hover:bg-[#1D2A22] text-[#10B981] border border-[#1D2A22] font-bold text-[11px] transition-none text-center"
                    >
                      [ INVESTIGATE_ISOLATION_NODE ]
                    </button>
                  </div>

                </div>

              </div>

              {/* LOGISTICS OPTIMIZATION SUMMARY FOOTER */}
              <section className="bg-[#111813] border border-[#1D2A22] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[#1D2A22] pb-2 text-[11px]">
                  <div className="text-[#8E9A92] font-bold uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#10B981]" />
                    LOGISTICS ROUTE OPTIMIZATION (TSP NEAREST-NEIGHBOR)
                  </div>
                  <div className="text-[#8E9A92]">HEURISTIC: O(N log N)</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                  <div className="bg-[#090E0B] p-3 border border-[#1D2A22]">
                    <div className="text-[10px] text-[#8E9A92]">DISTANCE_SAVED</div>
                    <div className="text-xl font-bold text-white">42.8 KM</div>
                    <div className="text-[10px] text-[#10B981]">-28.4% VS BASELINE</div>
                  </div>

                  <div className="bg-[#090E0B] p-3 border border-[#1D2A22]">
                    <div className="text-[10px] text-[#8E9A92]">FUEL_CONSERVED</div>
                    <div className="text-xl font-bold text-white">15.0 L</div>
                    <div className="text-[10px] text-[#E11D48]">HEAVY DIESEL FLEET</div>
                  </div>

                  <div className="bg-[#090E0B] p-3 border border-[#1D2A22]">
                    <div className="text-[10px] text-[#8E9A92]">CO2_REDUCED</div>
                    <div className="text-xl font-bold text-white">40.2 KG</div>
                    <div className="text-[10px] text-[#10B981]">CARBON OFFSET</div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="p-4 bg-[#111813] border border-[#1D2A22]">
              {children}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
