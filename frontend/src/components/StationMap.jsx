import React, { useEffect, Suspense } from 'react';
import L from 'leaflet';

// Custom Leaflet marker icons
const createCustomIcon = (color) => L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 6px ${color};"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Dynamically import react-leaflet to avoid SSR/build issues
const MapContainer = React.lazy(() => import('react-leaflet').then(m => ({ default: m.MapContainer })));
const TileLayer = React.lazy(() => import('react-leaflet').then(m => ({ default: m.TileLayer })));
const Marker = React.lazy(() => import('react-leaflet').then(m => ({ default: m.Marker })));
const Popup = React.lazy(() => import('react-leaflet').then(m => ({ default: m.Popup })));

function MapBoundsFitter({ stations }) {
  // Import useMap lazily inside the component
  const [useMapHook, setUseMapHook] = React.useState(null);

  useEffect(() => {
    import('react-leaflet').then(m => setUseMapHook(() => m.useMap));
  }, []);

  if (!useMapHook) return null;
  return <BoundsFitterInner stations={stations} useMapHook={useMapHook} />;
}

function BoundsFitterInner({ stations, useMapHook }) {
  const map = useMapHook();
  useEffect(() => {
    try {
      if (stations && stations.length > 0 && map) {
        const bounds = L.latLngBounds(stations.map(st => [st.latitude, st.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (e) {
      console.warn('Map bounds fit failed:', e);
    }
  }, [stations, map]);
  return null;
}

function MapFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#090E0B] border border-[#1D2A22]">
      <div className="text-[#8E9A92] text-xs font-mono text-center space-y-1">
        <div className="text-[#10B981] font-bold">⟳ LOADING MAP...</div>
        <div>GEOSPATIAL MATRIX INITIALIZING</div>
      </div>
    </div>
  );
}

export default function StationMap({ stations = [] }) {
  const defaultCenter = [17.69, 78.86]; // Midpoint between Hyderabad and Warangal

  return (
    <div className="w-full h-80 rounded-none overflow-hidden border border-[#1D2A22] shadow-2xl relative">
      <Suspense fallback={<MapFallback />}>
        <MapContainer
          center={defaultCenter}
          zoom={9}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '320px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stations.map((st) => {
            const color = st.station_type === 'Air' ? '#10b981' : st.station_type === 'Water' ? '#06b6d4' : '#8b5cf6';
            return (
              <Marker
                key={st.id}
                position={[st.latitude, st.longitude]}
                icon={createCustomIcon(color)}
              >
                <Popup>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#111', padding: '4px' }}>
                    <div style={{ fontWeight: 'bold', color: '#065f46' }}>{st.name}</div>
                    <div style={{ color: '#555' }}>{st.code} · {st.station_type}</div>
                    <div style={{ color: '#555' }}>{st.location_name}</div>
                    <div style={{ marginTop: '4px', fontWeight: 'bold', color: '#059669' }}>● {st.status}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Suspense>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-[#111813]/90 border border-[#1D2A22] p-2 z-[400] text-[10px] font-mono text-[#8E9A92] space-y-1">
        <div className="font-bold text-white text-[11px] mb-1">STATIONS</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>Air</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>Water</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>Multi</div>
      </div>
    </div>
  );
}
