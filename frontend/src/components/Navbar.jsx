import React from 'react';
import { Compass, ShieldAlert, Users, Bell, Radio } from 'lucide-react';

export default function Navbar({ activeAlertsCount = 2 }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-jungle-700 px-5 py-3 flex items-center justify-between shadow-2xl">
      {/* Brand & Tactical Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold shadow-md shadow-amber-500/20">
          <Compass className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-100 flex items-center gap-2 font-mono tracking-tight uppercase">
            ISLA ECO-RESERVE MONITORING SYSTEM
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              TACTICAL CONTROL
            </span>
          </h1>
          <p className="text-xs text-emerald-400/80 font-mono text-[11px]">
            Bio-Reserve Telemetry • Canopy Sensors • Tactical Optimization
          </p>
        </div>
      </div>

      {/* Team Credits & Tactical Perimeter Status */}
      <div className="flex items-center space-x-3">
        {/* Team Credits Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-jungle-900 border border-jungle-700 text-xs text-slate-300">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-400/90 font-bold font-mono text-[11px]">OPERATORS:</span>
          <span className="text-slate-200 font-medium text-[11px]">
            P. Varshith • Snehith • Sai Vishal • Arjun • BV. Charan
          </span>
        </div>

        {/* Tactical Perimeter Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold text-[11px]">PERIMETER SECURE</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-jungle-900 border border-jungle-700 text-amber-400 hover:text-amber-300 hover:bg-jungle-800 transition">
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center">
              {activeAlertsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
