import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Leaflet marker icons
const createCustomIcon = (color) => L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

function MapBoundsFitter({ stations }) {
  const map = useMap();
  useEffect(() => {
    if (stations && stations.length > 0) {
      const bounds = L.latLngBounds(stations.map(st => [st.latitude, st.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stations, map]);
  return null;
}

export default function StationMap({ stations = [] }) {
  const defaultCenter = [17.40, 78.45]; // Hyderabad center

  return (
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
        
        <MapBoundsFitter stations={stations} />

        {stations.map((st) => {
          const color = st.station_type === 'Air' ? '#10b981' : st.station_type === 'Water' ? '#06b6d4' : '#8b5cf6';
          return (
            <Marker
              key={st.id}
              position={[st.latitude, st.longitude]}
              icon={createCustomIcon(color)}
            >
              <Popup className="custom-popup">
                <div className="p-2 text-slate-900 font-sans space-y-1">
                  <div className="font-bold text-sm text-emerald-700">{st.name}</div>
                  <div className="text-xs font-semibold text-slate-600">Code: {st.code} ({st.station_type})</div>
                  <div className="text-xs text-slate-500">Location: {st.location_name}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Status: {st.status}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700/70 p-2.5 rounded-xl z-[400] text-[11px] font-medium text-slate-300 space-y-1.5 backdrop-blur-md">
        <div className="font-bold text-slate-200 text-xs mb-1">Station Types</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
          <span>Air Monitoring</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block shadow-sm"></span>
          <span>Water Quality</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block shadow-sm"></span>
          <span>Multi-Sensor Array</span>
        </div>
      </div>
    </div>
  );
}
