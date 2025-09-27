import React, { useMemo, useEffect } from 'react';

// Tipos comuns
export type LatLng = { latitude: number; longitude: number };
export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

type MapProps = {
  style?: React.CSSProperties | any;
  region: Region;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean; // ignorado no web
  children?: React.ReactNode;
};
type MarkerProps = {
  coordinate: LatLng;
  title?: string;
  description?: string;
  pinColor?: string; // ignorado no web
};

// injeta CSS via CDN para evitar `url(...)` no CSS local do leaflet
function ensureLeafletCss() {
  if (typeof document === 'undefined') return;
  const id = 'leaflet-css-cdn';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.crossOrigin = '';
  document.head.appendChild(link);
}

function setupLeafletIcons(L: any) {
  const base = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: base + 'marker-icon-2x.png',
    iconUrl: base + 'marker-icon.png',
    shadowUrl: base + 'marker-shadow.png',
  });
}

export function MapView({ style, region, showsUserLocation, children }: MapProps) {
  const { MapContainer, TileLayer, Marker: LMarker, Popup } = require('react-leaflet');
  const L = require('leaflet');

  useEffect(() => {
    ensureLeafletCss();
    setupLeafletIcons(L);
  }, []);

  const zoom = Math.max(3, Math.min(18, Math.round(Math.log2(360 / Math.max(region.latitudeDelta, region.longitudeDelta)))));
  const center: [number, number] = [region.latitude, region.longitude];
  const containerStyle: React.CSSProperties = useMemo(() => ({ ...(style as any), width: '100%', height: '100%' }), [style]);

  return (
    <MapContainer center={center} zoom={zoom} style={containerStyle}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {showsUserLocation && (
        <LMarker position={center}><Popup>Você</Popup></LMarker>
      )}
      {children}
    </MapContainer>
  );
}

export function Marker({ coordinate, title, description }: MarkerProps) {
  const { Marker: LMarker, Popup } = require('react-leaflet');
  const pos: [number, number] = [coordinate.latitude, coordinate.longitude];
  return (
    <LMarker position={pos}>
      {(title || description) && (
        <Popup>
          <div>
            <b>{title || 'Ponto'}</b><br />
            {description || ''}
          </div>
        </Popup>
      )}
    </LMarker>
  );
}
