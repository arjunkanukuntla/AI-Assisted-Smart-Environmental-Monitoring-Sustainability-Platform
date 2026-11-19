import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const nodeIcon = (pct) => {
  const color = pct >= 90 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#3b82f6';
  return L.divIcon({
    className: 'node-map-icon',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 0 8px ${color};">${Math.round(pct)}%</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export default function RouteVisualizer({ stops = [], totalKm = 0, fuelSaved = 0, co2Saved = 0 }) {
  const defaultCenter = [17.40, 78.45];

  // Build path coordinates from stops
  const polylineCoords = stops.map(s => [s.latitude, s.longitude]);

  return (
    <div className="space-y-3 font-sans">
      <div className="w-full h-80 rounded-md overflow-hidden border border-[#1F2937] relative">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stops.map((stop, index) => (
            <Marker
              key={stop.id || index}
              position={[stop.latitude, stop.longitude]}
              icon={nodeIcon(stop.bin_capacity_pct)}
            >
              <Popup>
                <div className="p-1.5 text-zinc-100 font-sans space-y-1">
                  <div className="font-semibold text-xs text-white">Stop #{index + 1}: {stop.zone_name}</div>
                  <div className="text-[11px] text-zinc-300">Collector: {stop.collector_assigned}</div>
                  <div className="text-[11px] text-zinc-400">Waste: {stop.waste_type}</div>
                  <div className="text-[11px] font-mono font-semibold text-amber-400">Capacity: {stop.bin_capacity_pct}%</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {polylineCoords.length > 1 && (
            <Polyline
              positions={polylineCoords}
              color="#FAFAFA"
              weight={3}
              dashArray="6, 6"
            />
          )}
        </MapContainer>
      </div>

      {/* Optimization Summary Bar */}
      <div className="p-3.5 rounded-md bg-[#09090B] border border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs font-mono tabular-nums">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-sans">Total Distance:</span>
          <span className="text-white font-semibold text-sm">{totalKm} km</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-sans">Fuel Conserved:</span>
          <span className="text-sky-400 font-semibold text-sm">{fuelSaved} L</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-sans">CO₂ Offset:</span>
          <span className="text-zinc-200 font-semibold text-sm">{co2Saved} kg</span>
        </div>
      </div>
    </div>
  );
}
