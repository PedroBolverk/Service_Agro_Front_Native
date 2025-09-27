import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Switch, Platform, Button } from 'react-native';
import { MapView, Marker } from '@components/MapAdapter'; // seu adaptador para mapa
import { connectSocket } from '../lib/socket';
import * as Location from 'expo-location';
import { useAuth } from '../store/auth';
import { Socket } from 'socket.io-client'; // Corrigido: Socket importado corretamente
import { Region } from 'react-native-maps'; // Corrigido: Region importado corretamente

// Definição do tipo NearbyItem
type NearbyItem = {
  userId: string;
  fullName?: string;
  specialty?: string;
  lat: number;
  lng: number;
  isAvailable?: boolean;
  lastSeen?: number | null;
};

export default function MapUnified({ token }: { token: string }) {
  const { user } = useAuth();
  const role = user?.role || 'PRODUCER';

  const [region, setRegion] = useState<Region | null>(null); // Estado para a região do mapa
  const [items, setItems] = useState<NearbyItem[]>([]); // Estado para armazenar os mecânicos
  const [available, setAvailable] = useState(true); // Estado para determinar se o mecânico está disponível
  const [lastNearbyAt, setLastNearbyAt] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null); // Referência para o socket
  const watchSubRef = useRef<Location.LocationSubscription | null>(null);
  const nearbyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchTs = useRef(0);

  const requestPosOnce = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Permissão de localização negada');
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: coords.latitude, lng: coords.longitude };
  };

  // Função para emitir a busca de mecânicos de forma controlada (evitar múltiplos pedidos em um curto período de tempo)
  const emitNearbyThrottled = (lat: number, lng: number) => {
    const now = Date.now();
    if (now - lastSearchTs.current < 3000) return; // Evita múltiplos pedidos rapidamente
    lastSearchTs.current = now;
    socketRef.current?.emit('nearby:search', { lat, lng, radiusKm: 10000, limit: 5000 });
    console.log('[CLIENT] Enviando busca de mecânicos...');
  };

  // Função para ser chamada quando o botão de "Atualizar agora" for pressionado
  const doNearbyNow = () => region && emitNearbyThrottled(region.latitude, region.longitude);

  // Função para começar a observação da localização do usuário
  const startWatcher = async (onUpdate: (lat: number, lng: number) => void) => {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Platform.OS === 'ios' ? Location.Accuracy.High : Location.Accuracy.Balanced,
        timeInterval: 3000,
        distanceInterval: 10,
      },
      (u) => onUpdate(u.coords.latitude, u.coords.longitude)
    );
    watchSubRef.current = sub;
  };

  useEffect(() => {
    (async () => {
      const pos = await requestPosOnce();
      const initial: Region = { latitude: pos.lat, longitude: pos.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 };
      setRegion(initial);
      console.log('[CLIENT] Posição inicial:', pos);

      const s = connectSocket('location', token);
      socketRef.current = s;

      s.on('connect', () => {
        console.log('[CLIENT] Mecânico conectado');
        s.emit('loc:update', { lat: pos.lat, lng: pos.lng, isAvailable: available });
      });

      s.on('mechanic:location', (loc: NearbyItem) => {
        console.log('[CLIENT] Localização do mecânico recebida:', loc);
        setItems((prev) => {
          const existing = prev.find(item => item.userId === loc.userId);
          if (existing) {
            return prev.map(item =>
              item.userId === loc.userId ? { ...item, lat: loc.lat, lng: loc.lng, isAvailable: loc.isAvailable } : item
            );
          }
          return [...prev, loc];
        });
      });

      s.on('nearby:result', (data) => {
        console.log('[CLIENT] Mecânicos próximos recebidos:', data.items);
        setItems(data.items); // Atualiza os itens no estado
      });

      if (role === 'PRODUCER') {
        s.on('connect', () => {
          emitNearbyThrottled(pos.lat, pos.lng);
          nearbyIntervalRef.current = setInterval(() => {
            if (!region) return;
            emitNearbyThrottled(region.latitude, region.longitude);
          }, 5000);
        });

        s.on('nearby:result', (d: { items: NearbyItem[] }) => {
          console.log('[CLIENT] Mecânicos próximos recebidos:', d.items);
          setItems(d?.items ?? []);
          setLastNearbyAt(Date.now());
        });
      } else {
        s.on('connect', () => s.emit('loc:update', { lat: pos.lat, lng: pos.lng, isAvailable: available }));
        await startWatcher((lat, lng) => {
          setRegion((prev) => (prev ? { ...prev, latitude: lat, longitude: lng } : { latitude: lat, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }));
          s.emit('loc:update', { lat, lng, isAvailable: available });
        });
      }
    })();

    return () => {
      watchSubRef.current?.remove();
      if (nearbyIntervalRef.current) clearInterval(nearbyIntervalRef.current);
      socketRef.current?.disconnect();
    };
  }, [token, role, available]);

  if (!region) return <Text>Carregando mapa…</Text>;

  return (
    <View style={{ flex: 1 }}>
      {role === 'MECHANIC' && (
        <View style={{ padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Disponível</Text>
          <Switch value={available} onValueChange={setAvailable} />
        </View>
      )}

      {role === 'PRODUCER' && (
        <View style={{ padding: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
          <Text>Itens: {items.length} {lastNearbyAt ? `• ${new Date(lastNearbyAt).toLocaleTimeString()}` : ''}</Text>
          <View style={{ alignSelf: 'flex-start', marginTop: 6 }}>
            <Button title="Atualizar agora" onPress={doNearbyNow} />
          </View>
        </View>
      )}

      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={(newRegion: Region) => {
          console.log('[CLIENT] Região do mapa atualizada:', newRegion);
        }}
      >
        {role === 'PRODUCER' &&
          items.map((m) => (
            <Marker
              key={m.userId}
              coordinate={{ latitude: m.lat, longitude: m.lng }}
              title={m.fullName || 'Mecânico'}
              description={m.specialty || (m.isAvailable ? 'Disponível' : 'Indisponível')}
              pinColor={m.isAvailable ? undefined : 'gray'}
            />
          ))}
      </MapView>
    </View>
  );
}
