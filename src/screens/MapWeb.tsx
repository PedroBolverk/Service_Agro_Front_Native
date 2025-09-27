// src/screens/MapWeb.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../store/auth';
import { connectSocket } from '../lib/socket';

// importa os componentes, mas vamos usar "as any" ao renderizar
import { MapContainer, TileLayer, Marker as LMarker, Popup } from 'react-leaflet';
import L from 'leaflet';

type NearbyItem = {
  userId: string; fullName?: string; specialty?: string;
  lat: number; lng: number; isAvailable?: boolean; lastSeen?: number|null;
};

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

function setupLeafletIcons() {
  const base = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
  // @ts-ignore
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: base + 'marker-icon-2x.png',
    iconUrl: base + 'marker-icon.png',
    shadowUrl: base + 'marker-shadow.png',
  });
}

export default function MapWeb({ token }: { token: string }) {
  const { user } = useAuth();
  const role = user?.role || 'PRODUCER';

  const [center, setCenter] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(14);
  const [items, setItems] = useState<NearbyItem[]>([]);
  const [lastNearbyAt, setLastNearbyAt] = useState<number | null>(null);
  const [msg, setMsg] = useState('Carregando…');

  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const nearbyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchTs = useRef(0);

  const emitNearbyThrottled = (lat:number,lng:number) => {
    const now = Date.now();
    if (now - lastSearchTs.current < 3000) return;
    lastSearchTs.current = now;
    socketRef.current?.emit('nearby:search', { lat, lng, radiusKm: __DEV__ ? 3000 : 50, limit: 50 });
  };

  useEffect(() => {
    ensureLeafletCss();
    setupLeafletIcons();

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Permissão negada');
      } catch {}
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const lat = p.coords.latitude, lng = p.coords.longitude;
          setCenter([lat, lng]);
          setMsg(role === 'PRODUCER' ? 'Produtor — buscando mecânicos…' : 'Mecânico — transmitindo…');
          const s = connectSocket('location', token);
          socketRef.current = s;

          if (role === 'PRODUCER') {
            s.on('connect', () => {
              emitNearbyThrottled(lat, lng);
              nearbyIntervalRef.current = setInterval(() => {
                emitNearbyThrottled((center?.[0] ?? lat), (center?.[1] ?? lng));
              }, 5000);
            });
            s.on('nearby:result', (d: { items: NearbyItem[] }) => {
              setItems(d?.items ?? []); setLastNearbyAt(Date.now());
            });
            s.on('mechanic:location', (loc: { userId:string; lat:number; lng:number; isAvailable?:boolean }) => {
              setItems(prev => prev.map(m => m.userId === loc.userId ? { ...m, lat: loc.lat, lng: loc.lng, isAvailable: loc.isAvailable } : m));
            });
          } else {
            s.on('connect', () => s.emit('loc:update', { lat, lng, isAvailable: true }));
          }
        },
        (err) => setMsg(`Erro localização: ${err?.message || err}`),
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 10 },
        (u) => {
          const lat = u.coords.latitude, lng = u.coords.longitude;
          setCenter([lat, lng]);
          if (role === 'PRODUCER') {
            emitNearbyThrottled(lat, lng);
          } else {
            socketRef.current?.emit('loc:update', { lat, lng, isAvailable: true });
          }
        }
      ).then(sub => watchRef.current = sub);
    })();

    return () => {
      watchRef.current?.remove();
      if (nearbyIntervalRef.current) clearInterval(nearbyIntervalRef.current);
      socketRef.current?.disconnect();
    };
  }, [token, role]);

  const mapStyle: React.CSSProperties = useMemo(() => ({ width:'100%', height:'100%' }), []);

  if (!center) {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
        <Text>{msg}</Text>
      </View>
    );
  }

  // ⬇️ casts para driblar TS no ambiente RN+web
  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      {role === 'PRODUCER' && (
        <View style={{ padding:8, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#eee' }}>
          <Text>Itens: {items.length} {lastNearbyAt ? `• ${new Date(lastNearbyAt).toLocaleTimeString()}` : ''}</Text>
          <View style={{ alignSelf:'flex-start', marginTop:6 }}>
            <Button title="Atualizar agora" onPress={() => emitNearbyThrottled(center[0], center[1])} />
          </View>
        </View>
      )}

      <MapContainerAny center={center} zoom={zoom} style={mapStyle}>
        <TileLayerAny attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LMarker position={center}><Popup>Você</Popup></LMarker>
        {role === 'PRODUCER' && items.map(m => (
          <LMarker key={m.userId} position={[m.lat, m.lng]}>
            <Popup>
              <div>
                <b>{m.fullName || 'Mecânico'}</b><br/>
                {m.specialty || (m.isAvailable ? 'Disponível' : 'Indisponível')}
              </div>
            </Popup>
          </LMarker>
        ))}
      </MapContainerAny>
    </View>
  );
}
