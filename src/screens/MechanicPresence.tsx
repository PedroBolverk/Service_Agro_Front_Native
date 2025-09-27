// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Switch, Alert } from 'react-native';
// import MapView, { Marker, Region } from 'react-native-maps';
// import { connectSocket } from '../lib/socket';
// import { getCurrent, watchPosition } from '../lib/location';

// export default function MechanicPresence({ token }: { token: string }) {
//   const [available, setAvailable] = useState(true);
//   const [region, setRegion] = useState<Region | null>(null);
//   const [self, setSelf] = useState<{ lat: number; lng: number } | null>(null);
//   const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);

//   useEffect(() => {
//     let stopWatch: (() => void) | null = null;

//     (async () => {
//       const pos = await getCurrent();
//       setRegion({ latitude: pos.lat, longitude: pos.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 });
//       setSelf({ lat: pos.lat, lng: pos.lng });

//       const s = connectSocket('location', token);
//       s.on('connect', () => {
//         s.emit('loc:update', { lat: pos.lat, lng: pos.lng, isAvailable: available });
//       });
//       s.on('error', (e: any) => Alert.alert('WS error', JSON.stringify(e)));
//       socketRef.current = s;

//       stopWatch = await watchPosition((lat, lng) => {
//         setSelf({ lat, lng });
//         s.emit('loc:update', { lat, lng, isAvailable: available });
//       });
//     })();

//     return () => {
//       stopWatch?.();
//       socketRef.current?.disconnect();
//     };
//   }, [token, available]);

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={{ padding: 12, backgroundColor: '#fff' }}>
//         <Text style={{ fontWeight: '600', marginBottom: 8 }}>Disponível</Text>
//         <Switch value={available} onValueChange={setAvailable} />
//       </View>

//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={region || undefined}
//         region={region || undefined}
//         showsUserLocation
//       >
//         {self && (
//           <Marker coordinate={{ latitude: self.lat, longitude: self.lng }} title="Você" description={available ? 'Disponível' : 'Indisponível'} />
//         )}
//       </MapView>
//     </View>
//   );
// }
