// app/mechanic-web.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, Text, Button, Switch, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../src/store/auth';
import { connectSocket } from '../src/lib/socket';

export default function MechanicWeb() {
  const { token, user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [available, setAvailable] = useState(true);
  const [last, setLast] = useState<{lat:number; lng:number} | null>(null);
  const [msg, setMsg] = useState<string>('Pronto para conectar');
  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const lastEmitRef = useRef<number>(0);

  useEffect(() => {
    if (!token) { setMsg('Faça login como MECHANIC'); return; }
    if (user?.role !== 'MECHANIC') { setMsg('Precisa ser MECHANIC para compartilhar localização'); }
  }, [token, user]);

  const connect = () => {
    if (!token) return;
    const s = connectSocket('location', token);
    socketRef.current = s;

    s.on('connect', () => { setConnected(true); setMsg('Conectado'); });
    s.on('connect_error', (e:any) => setMsg(`Erro de conexão: ${e?.message || e}`));
    s.on('error', (e:any) => setMsg(`WS error: ${JSON.stringify(e)}`));
  };

  const start = async () => {
    if (!socketRef.current || !socketRef.current.connected) {
      setMsg('Conecte primeiro'); return;
    }
    if (!('geolocation' in navigator)) {
      setMsg('Geolocalização não suportada no navegador'); return;
    }
    // Permissão + posição inicial
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setMsg('Permissão de localização negada'); return; }
    } catch {
      // no web o expo-location delega; se falhar, tentamos direto via navigator
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        socketRef.current?.emit('loc:update', { lat, lng, isAvailable: available });
        setLast({ lat, lng });
        setMsg('Enviando posição inicial…');
      },
      (err) => setMsg(`Erro getCurrent: ${err?.message || err}`),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    // watch contínuo (throttle 2s)
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Platform.OS === 'ios' ? Location.Accuracy.High : Location.Accuracy.Balanced,
        timeInterval: 2000,
        distanceInterval: 1,
      },
      (u) => {
        const lat = u.coords.latitude;
        const lng = u.coords.longitude;
        const now = Date.now();
        if (now - lastEmitRef.current < 1800) return;
        lastEmitRef.current = now;
        socketRef.current?.emit('loc:update', { lat, lng, isAvailable: available });
        setLast({ lat, lng });
        setMsg('Transmitindo…');
      }
    );

    setSharing(true);
  };

  const stop = () => {
    watchRef.current?.remove();
    watchRef.current = null;
    setSharing(false);
    setMsg('Compartilhamento parado');
  };

  const disconnect = () => {
    stop();
    socketRef.current?.disconnect();
    socketRef.current = null;
    setConnected(false);
    setMsg('Desconectado');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mecânico (Web) — compartilhar localização</Text>

      <Text style={styles.note}>
        Dica: no navegador, geolocalização só funciona em HTTPS ou em <Text style={{fontWeight:'700'}}>http://localhost</Text>.
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Disponível</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>

      <View style={styles.btnRow}>
        <Button title={connected ? 'Conectado' : 'Conectar'} onPress={connect} disabled={connected || !token} />
        <View style={{width:10}} />
        <Button title="Desconectar" onPress={disconnect} disabled={!connected} />
      </View>

      <View style={styles.btnRow}>
        <Button title="Começar a compartilhar" onPress={start} disabled={!connected || sharing} />
        <View style={{width:10}} />
        <Button title="Parar" onPress={stop} disabled={!sharing} />
      </View>

      <View style={styles.info}>
        <Text>Status: {msg}</Text>
        <Text>Login: {user?.email} ({user?.role})</Text>
        <Text>Última posição: {last ? `${last.lat.toFixed(6)}, ${last.lng.toFixed(6)}` : '-'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:20, gap:14 },
  title: { fontSize:18, fontWeight:'700', color:'#111' },
  note: { color:'#333' },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  label: { fontWeight:'600', color:'#111' },
  btnRow: { flexDirection:'row', alignItems:'center' },
  info: { paddingTop:10, borderTopWidth:1, borderTopColor:'#eee', gap:4 },
});
