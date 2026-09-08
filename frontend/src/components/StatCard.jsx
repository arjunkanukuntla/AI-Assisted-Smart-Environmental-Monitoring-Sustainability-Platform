import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, unit = '', subtitle, icon: Icon, color = 'emerald', trend = 'neutral', trendValue = '' }) {
  const colorStyles = {
    emerald: 'from-emerald-950/40 to-jungle-900/40 text-emerald-400 border-emerald-500/40',
    cyan: 'from-teal-950/40 to-jungle-900/40 text-teal-300 border-teal-500/40',
    amber: 'from-amber-950/40 to-jungle-900/40 text-amber-400 border-amber-500/40',
    rose: 'from-rose-950/40 to-jungle-900/40 text-rose-400 border-rose-500/40',
    indigo: 'from-jungle-800/40 to-jungle-900/40 text-emerald-300 border-jungle-600/40',
  }[color] || 'from-emerald-950/40 to-jungle-900/40 text-emerald-400 border-emerald-500/40';

  return (
    <div className={`p-4 rounded-2xl glass-card border bg-gradient-to-br ${colorStyles}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-widest font-mono">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-jungle-950 border border-jungle-700 text-amber-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">{value}</span>
          {unit && <span className="ml-1.5 text-xs font-mono font-bold text-amber-400/80">{unit}</span>}
        </div>

        {trendValue && (
          <div className={`flex items-center text-xs font-mono font-bold px-2 py-0.5 rounded ${
            trend === 'up' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            trend === 'down' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
            'bg-jungle-900 text-slate-400'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 font-mono font-medium truncate">{subtitle}</p>
      )}
    </div>
  );
}
