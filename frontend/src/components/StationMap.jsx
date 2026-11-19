import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

const createCustomIcon = (color, isSelected = false) => L.divIcon({
  className: 'custom-map-icon',
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      ${isSelected ? `<span style="position:absolute;width:28px;height:28px;border-radius:50%;background:${color};opacity:0.35;animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
      <div style="background-color:${color};width:${isSelected ? '18px' : '13px'};height:${isSelected ? '18px' : '13px'};border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 10px ${color};"></div>
    </div>
  `,
  iconSize: [isSelected ? 28 : 16, isSelected ? 28 : 16],
  iconAnchor: [isSelected ? 14 : 8, isSelected ? 14 : 8]
});

// Safe bounds fitter that runs once when stations load
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

// Map Controller for smooth flyTo when user searches or clicks a location
function MapController({ selectedStation }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStation && selectedStation.latitude && selectedStation.longitude) {
      try {
        map.flyTo([selectedStation.latitude, selectedStation.longitude], 12, {
          duration: 1.2
        });
      } catch (e) {
        // ignore
      }
    }
  }, [selectedStation, map]);

  return null;
}

export default function StationMap({ stations = [], selectedStation = null, onSelectStation = null, height = '360px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <MapContainer
        center={[17.40, 78.48]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stations={stations} />
        <MapController selectedStation={selectedStation} />

        {stations.map((st) => {
          const isSelected = selectedStation?.id === st.id || selectedStation?.code === st.code;
          const color = st.station_type === 'Air' ? '#10b981'
            : st.station_type === 'Water' ? '#06b6d4' : '#8b5cf6';
          
          return (
            <Marker
              key={st.id || st.code}
              position={[st.latitude, st.longitude]}
              icon={createCustomIcon(color, isSelected)}
              eventHandlers={{
                click: () => onSelectStation && onSelectStation(st)
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Outfit, system-ui, sans-serif', fontSize: '12px', lineHeight: '1.5', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600', color: '#f8fafc', fontSize: '13px' }}>{st.name}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#1e293b',
                      color: color
                    }}>{st.station_type}</span>
                  </div>

                  <div style={{ color: '#A1A1AA', fontSize: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin style={{ width: '12px', height: '12px', flexShrink: 0, color: '#A1A1AA' }} />
                    <span>{st.location_name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', background: '#09090B', border: '1px solid #27272A', borderRadius: '6px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A1A1AA', fontWeight: '600' }}>Status</div>
                      <div style={{ color: '#10b981', fontWeight: '600', fontSize: '12px' }}>● {st.status || 'Active'}</div>
                    </div>
                    {st.aqi && (
                      <div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A1A1AA', fontWeight: '600' }}>AQI</div>
                        <div style={{ fontWeight: '600', color: st.aqi > 100 ? '#f59e0b' : '#10b981', fontSize: '12px' }}>{st.aqi}</div>
                      </div>
                    )}
                    {st.wqi && (
                      <div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A1A1AA', fontWeight: '600' }}>WQI</div>
                        <div style={{ fontWeight: '600', color: st.wqi < 60 ? '#f59e0b' : '#06b6d4', fontSize: '12px' }}>{st.wqi} / 100</div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectStation && onSelectStation(st)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      color: '#09090B',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Inspect Station Telemetry →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Station Type Legend */}
      <div style={{
        position: 'absolute', bottom: '12px', right: '12px',
        background: '#121215', border: '1px solid #27272A',
        borderRadius: '6px', padding: '8px 12px', zIndex: 1000,
        fontFamily: 'Outfit, system-ui, sans-serif', fontSize: '12px', color: '#A1A1AA'
      }}>
        <div style={{ fontWeight: '600', color: '#FAFAFA', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Monitoring Networks
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[['Air Quality Nodes', '#10b981'], ['Water Observatories', '#06b6d4'], ['Multi-Sensor Biosphere', '#a855f7']].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }}></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
