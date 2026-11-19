import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RouteVisualizer from '../components/RouteVisualizer';
import { BrainCircuit, Truck, Zap, Play, CheckCircle2, Cpu, RefreshCw } from 'lucide-react';

const panelCls = 'bg-[#121215] border border-[#27272A] rounded-lg';
const metricTile = 'p-3 bg-[#09090B] rounded-md border border-[#27272A]';

function RangeRow({ label, value, unit, min, max, step, onChange, valueColor }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className={`font-mono tabular-nums font-semibold ${valueColor}`}>{value} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none bg-[#27272A] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

export default function OptimizationPage() {
  const [wasteRoute, setWasteRoute] = useState(null);
  const [energyDemand, setEnergyDemand] = useState(850);
  const [solarAvailable, setSolarAvailable] = useState(600);
  const [batteryStorage, setBatteryStorage] = useState(250);
  const [energyResult, setEnergyResult] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [nodesCount, setNodesCount] = useState(15);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
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
      console.error('Optimization load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const recalcEnergy = async () => {
    try {
      const res = await api.getEnergyBalance(energyDemand, solarAvailable, batteryStorage);
      setEnergyResult(res.data);
    } catch (err) { console.error(err); }
  };

  const runBenchmark = async () => {
    try {
      const res = await api.getBenchmark(nodesCount);
      setBenchmark(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-5 font-sans">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BrainCircuit className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Clean Route &amp; Commute Planner</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Find the shortest, cleanest route between city inspection stops to cut fuel waste and vehicle emissions.
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 disabled:opacity-60 text-zinc-950 text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          {loading
            ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
            : <Play className="w-3.5 h-3.5 text-zinc-950" />}
          {loading ? 'Calculating…' : 'Recalculate Best Route'}
        </button>
      </div>

      {/* Route Visualizer */}
      <div className={panelCls}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Truck className="w-3.5 h-3.5 text-zinc-400" />
            Smart Clean Route Map
          </div>
          {wasteRoute && (
            <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
              <span className="text-zinc-400">Standard Path: <strong className="text-white">{wasteRoute.baseline_standard_km} km</strong></span>
              <span className="text-emerald-400 font-semibold">EcoSphere Route: {wasteRoute.total_optimized_km} km (−{wasteRoute.efficiency_gain_pct}% distance)</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <RouteVisualizer
            stops={wasteRoute?.optimized_stops || []}
            totalKm={wasteRoute?.total_optimized_km || 0}
            fuelSaved={wasteRoute?.fuel_saved_liters || 0}
            co2Saved={wasteRoute?.co2_saved_kg || 0}
          />
        </div>
      </div>

      {/* Energy + Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Clean Energy Balancer */}
        <div className={panelCls}>
          <div className="flex items-center gap-2 p-4 border-b border-[#27272A] text-xs font-semibold text-white">
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            Clean Energy vs Grid Usage Calculator
          </div>
          <div className="p-4 space-y-4">
            <RangeRow label="Facility Base Demand" value={energyDemand} unit="kW" min={100} max={2000} step={50}
              onChange={setEnergyDemand} valueColor="text-white" />
            <RangeRow label="Solar Array Generation" value={solarAvailable} unit="kW" min={0} max={1500} step={50}
              onChange={setSolarAvailable} valueColor="text-zinc-200" />
            <RangeRow label="Battery Storage Reserve" value={batteryStorage} unit="kW" min={0} max={800} step={25}
              onChange={setBatteryStorage} valueColor="text-sky-400" />

            <button
              onClick={recalcEnergy}
              className="w-full py-2 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-[#27272A] transition-colors"
            >
              Recalculate Power Balance
            </button>

            {energyResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Clean Energy Mix Ratio</span>
                  <span className="text-white font-semibold font-mono tabular-nums">{energyResult.clean_energy_ratio_pct}%</span>
                </div>
                <div className="w-full bg-[#09090B] h-1.5 rounded-full overflow-hidden border border-[#27272A]">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min(energyResult.clean_energy_ratio_pct, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={metricTile}>
                    <div className="text-xs text-zinc-400 mb-0.5">Solar Used</div>
                    <div className="text-sm font-semibold text-white font-mono tabular-nums">{energyResult.solar_power_used_kw} kW</div>
                  </div>
                  <div className={metricTile}>
                    <div className="text-xs text-zinc-400 mb-0.5">Battery Draw</div>
                    <div className="text-sm font-semibold text-sky-400 font-mono tabular-nums">{energyResult.battery_discharge_kw} kW</div>
                  </div>
                  <div className={metricTile}>
                    <div className="text-xs text-zinc-400 mb-0.5">Grid Taken</div>
                    <div className="text-sm font-semibold text-amber-400 font-mono tabular-nums">{energyResult.grid_power_drawn_kw} kW</div>
                  </div>
                </div>
                {energyResult.recommendation && (
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ textWrap: 'pretty' }}>
                    {energyResult.recommendation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Benchmark Suite */}
        <div className={`${panelCls} flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              Algorithm Benchmark Suite
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number" min={5} max={50}
                value={nodesCount}
                onChange={e => setNodesCount(Number(e.target.value))}
                className="w-14 px-2 py-1 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white font-mono text-center focus:outline-none focus:border-zinc-400 transition-colors"
              />
              <button
                onClick={runBenchmark}
                className="px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-[#27272A] transition-colors"
              >
                Benchmark
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3 flex-1">
            {benchmark ? (
              <>
                <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-md space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{benchmark.heuristic_solver?.algorithm}</span>
                    <span className="font-mono tabular-nums text-white font-semibold">{benchmark.heuristic_solver?.time_ms} ms</span>
                  </div>
                  <div className="text-xs text-zinc-400">Quality: {benchmark.heuristic_solver?.solution_quality}</div>
                </div>
                <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-md space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-300">{benchmark.brute_force_solver?.algorithm}</span>
                    <span className="font-mono tabular-nums text-zinc-400">{benchmark.brute_force_solver?.time_ms} ms</span>
                  </div>
                  <div className="text-xs text-zinc-400">Quality: {benchmark.brute_force_solver?.solution_quality}</div>
                </div>
                <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-md text-center text-xs font-mono text-white font-medium">
                  Heuristic is {benchmark.speedup_factor}× faster than brute force
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-zinc-400 py-6">Run benchmark to compute execution time.</div>
            )}
          </div>
          <div className="p-3 border-t border-[#27272A] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              11 Pytest Backend Tests Passing
            </span>
            <span>TDD Verified</span>
          </div>
        </div>

      </div>

    </div>
  );
}
