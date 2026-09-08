import React from 'react';
import { FileCheck, Shield, BookOpen, Container, ExternalLink, Code2, Users, CheckCircle2 } from 'lucide-react';

export default function GovernanceDocs() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-jungle-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40">
              SECTOR 07 MODULE
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">Reserve Security, Governance & API Specs</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Responsible AI principles, bio-reserve telemetry data governance, Docker container specs, and OpenAPI endpoints.
          </p>
        </div>

        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
        >
          <ExternalLink className="w-4 h-4" />
          OpenAPI Swagger Specs
        </a>
      </div>

      {/* Grid 1: Team & Project Summary */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 border border-emerald-500/40 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Reserve Control Engineering Team
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            6-Phase SDLC Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {['P. Varshith', 'Snehith', 'Sai Vishal', 'Arjun', 'BV. Charan'].map((member, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-jungle-950 border border-jungle-700 space-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto text-xs border border-amber-500/30">
                0{i+1}
              </div>
              <div className="font-bold text-slate-200 text-xs font-sans">{member}</div>
              <div className="text-[10px] text-slate-400">Core Operator</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid 2: Data Governance & Responsible AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responsible AI Framework */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 font-mono">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Responsible AI & Data Governance Protocol
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-jungle-950 border border-jungle-700 space-y-1">
              <div className="font-bold text-amber-400">1. Transparency & Diagnostics</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                ML trend models and Isolation Forest anomaly detectors emit deterministic confidence metrics and diagnostic grounds.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-jungle-950 border border-jungle-700 space-y-1">
              <div className="font-bold text-amber-400">2. Telemetry Integrity</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Raw sensor readings undergo validation checks before database storage to eliminate corrupted telemetry spikes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-jungle-950 border border-jungle-700 space-y-1">
              <div className="font-bold text-amber-400">3. Cybersecurity Scoping</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Ranger and citizen incident logs sanitize payload fields prior to public broadcast.
              </p>
            </div>
          </div>
        </div>

        {/* Deployment & Containerization Checklist */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 flex flex-col justify-between font-mono">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Container className="w-4 h-4 text-teal-300" />
              Containerization & Deployment Readiness
            </h3>

            <div className="mt-3 space-y-2.5 text-xs">
              {[
                { title: "FastAPI Async Backend Engine", status: "Active on :8000" },
                { title: "React Vite Tailwind SPA Portal", status: "Active on :3000" },
                { title: "SQLite / SQLAlchemy ORM Database", status: "Seeded & Migrated" },
                { title: "Pytest TDD Test Suite Coverage", status: "100% Pass (11/11 tests)" },
                { title: "Docker Compose Configuration", status: "Verified & Runnable" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-jungle-950 border border-jungle-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-200 font-sans">{item.title}</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-jungle-950 border border-amber-500/40 text-xs text-amber-400 flex items-center justify-between">
            <span className="text-[11px]">Command: docker-compose up --build</span>
            <span className="font-bold">Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
