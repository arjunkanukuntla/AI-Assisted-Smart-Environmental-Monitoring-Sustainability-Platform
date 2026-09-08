import React from 'react';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  BrainCircuit,
  Users,
  Radio,
  FileCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Tactical Control Center', zone: 'SECTOR 01', icon: LayoutDashboard },
  { id: 'phase1', label: 'Data & Sensor Registry', zone: 'SECTOR 02', icon: Database },
  { id: 'phase2', label: 'Canopy Analytics & ML', zone: 'SECTOR 03', icon: BarChart3 },
  { id: 'phase3', label: 'Decision & Route Solver', zone: 'SECTOR 04', icon: BrainCircuit },
  { id: 'phase4', label: 'Ranger & Public Portal', zone: 'SECTOR 05', icon: Users },
  { id: 'phase5', label: 'Satellite & IoT Feed', zone: 'SECTOR 06', icon: Radio },
  { id: 'phase6', label: 'Governance & Security', zone: 'SECTOR 07', icon: FileCheck },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-72 glass-panel border-r border-jungle-700 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Navigation Title */}
        <div className="px-3 pt-2">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono">
            RESERVE TELEMETRY SECTORS
          </p>
        </div>

        {/* Tab Navigation */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-900/60 to-jungle-800/40 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-jungle-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                  isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-jungle-900 text-slate-400'
                }`}>
                  {item.zone}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Card */}
      <div className="p-3.5 rounded-xl bg-jungle-900/80 border border-jungle-700 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between font-mono">
          <span className="text-[11px] font-bold text-amber-400">ISLA BIO-RESERVE</span>
          <span className="text-[10px] text-emerald-400 font-bold">GRID ONLINE</span>
        </div>
        <div className="w-full bg-jungle-950 h-1.5 rounded-full overflow-hidden border border-jungle-800">
          <div className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 h-full w-full rounded-full"></div>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
          Canopy grid, water basins, and perimeter telemetry operating at 100% efficiency.
        </p>
      </div>
    </aside>
  );
}
