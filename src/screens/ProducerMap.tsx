// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Button } from 'react-native';
// import MapView, { Marker, Region } from 'react-native-maps';
// import { connectSocket } from '../lib/socket';
// import { getCurrent, watchPosition } from '../lib/location';

// type NearbyItem = {
//   userId: string;
//   fullName?: string;
//   specialty?: string;
//   lat: number;
//   lng: number;
//   isAvailable?: boolean;
//   lastSeen?: number | null;
// };

// export default function ProducerMap({ token }: { token: string }) {
//   const [region, setRegion] = useState<Region | null>(null);
//   const [items, setItems] = useState<NearbyItem[]>([]);
//   const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
//   const lastSearchTs = useRef(0);

//   const emitNearby = (lat: number, lng: number) => {
//     const now = Date.now();
//     if (now - lastSearchTs.current < 3000) return; // throttle 3s
//     lastSearchTs.current = now;
//     socketRef.current?.emit('nearby:search', { lat, lng, radiusKm: 30, limit: 20 });
//   };

//   useEffect(() => {
//     let stopWatch: (() => void) | null = null;

//     (async () => {
//       const pos = await getCurrent();
//       const initial: Region = { latitude: pos.lat, longitude: pos.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 };
//       setRegion(initial);

//       const s = connectSocket('location', token);
//       s.on('connect', () => emitNearby(pos.lat, pos.lng));
//       s.on('nearby:result', (d: { items: NearbyItem[] }) => setItems(d?.items ?? []));
//       s.on('mechanic:location', (loc: { userId: string; lat: number; lng: number; isAvailable?: boolean }) => {
//         setItems(prev => prev.map(m => m.userId === loc.userId ? { ...m, lat: loc.lat, lng: loc.lng, isAvailable: loc.isAvailable } : m));
//       });
//       socketRef.current = s;

//       stopWatch = await watchPosition((lat, lng) => {
//         setRegion(prev => prev ? { ...prev, latitude: lat, longitude: lng } : { latitude: lat, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 });
//         emitNearby(lat, lng);
//       });
//     })();

//     return () => {
//       stopWatch?.();
//       socketRef.current?.disconnect();
//     };
//   }, [token]);

//   const refresh = () => region && emitNearby(region.latitude, region.longitude);
//   const track = (id: string) => socketRef.current?.emit('mechanic:track', { mechanicId: id });

//   if (!region) return <Text>Carregando mapa…</Text>;

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={region}
//         region={region}
//         showsUserLocation
//         showsMyLocationButton
//       >
//         {items.map((m) => (
//           <Marker
//             key={m.userId}
//             coordinate={{ latitude: m.lat, longitude: m.lng }}
//             title={m.fullName || 'Mecânico'}
//             description={m.specialty || (m.isAvailable ? 'Disponível' : 'Indisponível')}
//             pinColor={m.isAvailable ? undefined : 'gray'}
//             onPress={() => track(m.userId)}
//           />
//         ))}
//       </MapView>

//       <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
//         <Button title="Atualizar próximos" onPress={refresh} />
//       </View>
//     </View>
//   );
// }
