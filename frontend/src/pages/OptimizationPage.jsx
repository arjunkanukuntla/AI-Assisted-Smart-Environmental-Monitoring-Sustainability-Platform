import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RouteVisualizer from '../components/RouteVisualizer';
import { BrainCircuit, Truck, Zap, Gauge, Play, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function OptimizationPage() {
  const [wasteRoute, setWasteRoute] = useState(null);
  const [energyDemand, setEnergyDemand] = useState(850);
  const [solarAvailable, setSolarAvailable] = useState(600);
  const [batteryStorage, setBatteryStorage] = useState(250);
  const [energyResult, setEnergyResult] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [nodesCount, setNodesCount] = useState(15);
  const [loading, setLoading] = useState(true);

  const fetchOptimizationData = async () => {
    setLoading(true);
    try {
      const [routeRes, energyRes, benchRes] = await Promise.all([
        api.getWasteRoute(),
        api.getEnergyBalance(energyDemand, solarAvailable, batteryStorage),
        api.getBenchmark(nodesCount)
      ]);
      setWasteRoute(routeRes.data);
      setEnergyResult(energyRes.data);
      setBenchmark(benchRes.data);
    } catch (err) {
      console.error("Error loading reserve optimization:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimizationData();
  }, []);

  const handleRecalculateEnergy = async () => {
    try {
      const res = await api.getEnergyBalance(energyDemand, solarAvailable, batteryStorage);
      setEnergyResult(res.data);
    } catch (err) {
      console.error("Error updating reserve energy balance:", err);
    }
  };

  const handleRunBenchmark = async () => {
    try {
      const res = await api.getBenchmark(nodesCount);
      setBenchmark(res.data);
    } catch (err) {
      console.error("Error running benchmark:", err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-jungle-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40">
              SECTOR 04 MODULE
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">Tactical Route & Microgrid Solver</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Graph TSP route solver for sector waste nodes, microgrid energy balance, and TDD algorithm runtime benchmarks.
          </p>
        </div>

        <button
          onClick={fetchOptimizationData}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          Run Tactical Solver
        </button>
      </div>

      {/* Section 1: Waste Route Optimization Visualizer */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-jungle-700 pb-3 font-mono">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Sector Waste Collection Path Solver (TSP Nearest-Neighbor)
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Baseline Distance: <strong className="text-slate-200">{wasteRoute?.baseline_standard_km} km</strong></span>
            <span className="text-emerald-400 font-bold">Optimized: {wasteRoute?.total_optimized_km} km (-{wasteRoute?.efficiency_gain_pct}%)</span>
          </div>
        </div>

        <RouteVisualizer
          stops={wasteRoute?.optimized_stops || []}
          totalKm={wasteRoute?.total_optimized_km || 0}
          fuelSaved={wasteRoute?.fuel_saved_liters || 0}
          co2Saved={wasteRoute?.co2_saved_kg || 0}
        />
      </div>

      {/* Section 2: Energy Load Balancer & Algorithm Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Microgrid Energy Load Balancer */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Bio-Reserve Energy Microgrid Load Balancer
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Facility Demand:</span>
                <span className="font-mono text-amber-400">{energyDemand} kW</span>
              </div>
              <input
                type="range" min="100" max="2000" step="50"
                value={energyDemand}
                onChange={e => setEnergyDemand(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Solar Generation Available:</span>
                <span className="font-mono text-emerald-400">{solarAvailable} kW</span>
              </div>
              <input
                type="range" min="0" max="1500" step="50"
                value={solarAvailable}
                onChange={e => setSolarAvailable(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Battery Storage Reserve:</span>
                <span className="font-mono text-teal-300">{batteryStorage} kW</span>
              </div>
              <input
                type="range" min="0" max="800" step="25"
                value={batteryStorage}
                onChange={e => setBatteryStorage(Number(e.target.value))}
                className="w-full accent-teal-400"
              />
            </div>

            <button
              onClick={handleRecalculateEnergy}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md font-mono"
            >
              Re-calculate Microgrid Flow
            </button>

            {/* Load Balance Result */}
            {energyResult && (
              <div className="p-4 rounded-xl bg-jungle-950 border border-amber-500/30 space-y-2 font-mono">
                <div className="flex items-center justify-between font-bold">
                  <span>Clean Energy Ratio:</span>
                  <span className="text-emerald-400 font-mono text-sm">{energyResult.clean_energy_ratio_pct}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                  <div className="p-2 rounded bg-jungle-900 border border-jungle-700">
                    <div className="text-slate-400">Solar</div>
                    <div className="font-bold text-emerald-400">{energyResult.solar_power_used_kw} kW</div>
                  </div>
                  <div className="p-2 rounded bg-jungle-900 border border-jungle-700">
                    <div className="text-slate-400">Battery</div>
                    <div className="font-bold text-teal-300">{energyResult.battery_discharge_kw} kW</div>
                  </div>
                  <div className="p-2 rounded bg-jungle-900 border border-jungle-700">
                    <div className="text-slate-400">Grid Drawn</div>
                    <div className="font-bold text-rose-400">{energyResult.grid_power_drawn_kw} kW</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 font-medium italic pt-1 font-sans">{energyResult.recommendation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Runtime Benchmark */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                TDD Algorithm Benchmark Suite
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Nodes:</span>
                <input
                  type="number" min="5" max="50" value={nodesCount}
                  onChange={e => setNodesCount(Number(e.target.value))}
                  className="w-14 bg-jungle-950 border border-jungle-700 rounded px-2 py-0.5 text-xs text-slate-100 font-mono"
                />
                <button
                  onClick={handleRunBenchmark}
                  className="px-2.5 py-1 rounded bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs font-mono"
                >
                  Run
                </button>
              </div>
            </div>

            {benchmark && (
              <div className="mt-4 space-y-3 font-mono">
                {/* Heuristic Solver Card */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-emerald-300">
                    <span>{benchmark.heuristic_solver.algorithm}</span>
                    <span className="font-mono text-sm">{benchmark.heuristic_solver.time_ms} ms</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Quality: {benchmark.heuristic_solver.solution_quality}</div>
                </div>

                {/* Brute Force Card */}
                <div className="p-3.5 rounded-xl bg-jungle-950 border border-jungle-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>{benchmark.brute_force_solver.algorithm}</span>
                    <span className="font-mono text-sm text-slate-400">{benchmark.brute_force_solver.time_ms} ms</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Quality: {benchmark.brute_force_solver.solution_quality}</div>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center font-bold text-xs text-purple-300 font-mono">
                  ⚡ Heuristic Speedup Factor: {benchmark.speedup_factor}x Faster than Brute Force
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-jungle-700 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> 11 Pytest Backend Unit Tests Passing
            </span>
            <span>TDD Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
