import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon broken by webpack/vite bundling
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface SatelliteMapProps {
  lat: number;
  lng: number;
  label: string;
  address?: string;
}

export function SatelliteMap({ lat, lng, label, address }: SatelliteMapProps) {
  // Invalidate map size after mount so tiles render correctly inside flex containers
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-ember-border/40" style={{ height: 220 }}>
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        {/* Esri World Imagery — true satellite tiles, no API key needed */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          maxZoom={19}
        />
        {/* Labels overlay on top of satellite */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          opacity={0.6}
        />
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <div className="text-sm font-semibold">{label}</div>
            {address && <div className="text-xs text-gray-500 mt-0.5">{address}</div>}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
