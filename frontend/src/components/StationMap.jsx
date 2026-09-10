import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (color) => L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Safe bounds fitter that only runs once after map mounts
function FitBounds({ stations }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    if (!stations || stations.length === 0) return;
    try {
      const valid = stations.filter(s => s.latitude && s.longitude);
      if (valid.length > 0) {
        const bounds = L.latLngBounds(valid.map(s => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
        fitted.current = true;
      }
    } catch (e) {
      // silently ignore map bounds errors
    }
  }, [stations, map]);

  return null;
}

export default function StationMap({ stations = [] }) {
  return (
    <div style={{ width: '100%', height: '320px', position: 'relative' }}>
      <MapContainer
        center={[17.69, 78.86]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stations={stations} />

        {stations.map((st) => {
          const color = st.station_type === 'Air' ? '#10b981'
            : st.station_type === 'Water' ? '#06b6d4' : '#8b5cf6';
          return (
            <Marker
              key={st.id}
              position={[st.latitude, st.longitude]}
              icon={createCustomIcon(color)}
            >
              <Popup>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.6' }}>
                  <b style={{ color: '#065f46' }}>{st.name}</b><br />
                  <span style={{ color: '#555' }}>{st.code} · {st.station_type}</span><br />
                  <span style={{ color: '#555' }}>{st.location_name}</span><br />
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>● {st.status}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Station Type Legend */}
      <div style={{
        position: 'absolute', bottom: '10px', right: '10px',
        background: 'rgba(17,24,19,0.92)', border: '1px solid #1D2A22',
        padding: '8px 10px', zIndex: 1000, fontFamily: 'monospace', fontSize: '10px', color: '#8E9A92'
      }}>
        <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>STATION TYPES</div>
        {[['Air', '#10b981'], ['Water', '#06b6d4'], ['Multi-Sensor', '#8b5cf6']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }}></span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
