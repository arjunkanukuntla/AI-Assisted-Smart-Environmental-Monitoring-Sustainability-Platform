import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#09090B] border-t border-[#27272A] text-zinc-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
                ES
              </div>
              <span className="text-sm font-semibold text-white">
                EcoSphere
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Real-time air and water quality monitoring across 130 regional stations in India. Helping communities and teams stay informed with accurate local data.
            </p>
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>130 stations actively recording</span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate && onNavigate('map')} className="hover:text-white transition-colors">
                  Live Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('stations')} className="hover:text-white transition-colors">
                  Stations Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('analytics')} className="hover:text-white transition-colors">
                  Forecasts &amp; Trends
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('optimization')} className="hover:text-white transition-colors">
                  Route Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('incidents')} className="hover:text-white transition-colors">
                  Report an Issue
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer & API */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Developer Resources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>OpenAPI Swagger UI</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8000/redoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>ReDoc API Explorer</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('docs')} className="hover:text-white transition-colors">
                  System Specifications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('integrations')} className="hover:text-white transition-colors">
                  Hardware Sensor Gateways
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-5 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} EcoSphere Environmental Monitor. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Version 2.5</span>
            <span>·</span>
            <span className="text-zinc-400">ISO 14001 Audited</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
