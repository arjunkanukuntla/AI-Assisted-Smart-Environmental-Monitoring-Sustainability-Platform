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
    <div className="space-y-3">
      <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
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
                <div className="p-2 text-slate-900 space-y-1">
                  <div className="font-bold text-sm text-emerald-700">Stop #{index + 1}: {stop.zone_name}</div>
                  <div className="text-xs font-semibold">Collector: {stop.collector_assigned}</div>
                  <div className="text-xs">Waste Type: {stop.waste_type}</div>
                  <div className="text-xs font-bold text-rose-600">Fill Capacity: {stop.bin_capacity_pct}%</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {polylineCoords.length > 1 && (
            <Polyline
              positions={polylineCoords}
              color="#22c55e"
              weight={4}
              dashArray="6, 8"
            />
          )}
        </MapContainer>
      </div>

      {/* Optimization Summary Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total Route Distance:</span>
          <span className="text-emerald-400 font-bold text-sm">{totalKm} km</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Fuel Saved:</span>
          <span className="text-teal-300 font-bold text-sm">{fuelSaved} Liters</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">$CO_2$ Reduced:</span>
          <span className="text-cyan-300 font-bold text-sm">{co2Saved} kg</span>
        </div>
      </div>
    </div>
  );
}
