import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Switch,
  Platform,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import MapView, { Marker, Callout, Region, LatLng } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import  OpenMapDirections from 'react-native-navigation-directions';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import axios from 'axios';

import { connectSocket } from '../lib/socket';
import { useAuth } from '../store/auth';
import type { Socket } from 'socket.io-client';
import { Screen } from '../../components/layout/Screen';

// 🔧 ajuste sua BASE conforme seu servidor
const BASE_URL = 'http://192.168.0.73:3000';

// ✅ mesma key do seu app.json
const GOOGLE_MAPS_APIKEY = Platform.select({
  ios: 'AIzaSyCg0DxgEQcNAJr_e_7Ihi2rE8c-LFEcsqk',
  android: 'AIzaSyCg0DxgEQcNAJr_e_7Ihi2rE8c-LFEcsqk',
  default: 'AIzaSyCg0DxgEQcNAJr_e_7Ihi2rE8c-LFEcsqk',
}) as string;

// 🎨 personalização da linha da rota
const ROUTE_COLOR = '#030213';
const ROUTE_WIDTH = 5;

type NearbyItem = {
  userId: string;
  fullName?: string;
  specialty?: string;
  lat: number;
  lng: number;
  isAvailable?: boolean;
  lastSeen?: number | null;
};

export default function MapUnified({
  token,
  solicitacaoServicoId: solicitacaoServicoIdProp,
}: {
  token: string;
  solicitacaoServicoId?: string;
}) {
  const { user } = useAuth();
  const role = user?.role || 'PRODUCER';
  const solicitacaoServicoId = solicitacaoServicoIdProp ?? '';

  const [visible, setVisible] = useState(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [items, setItems] = useState<NearbyItem[]>([]);
  const [available, setAvailable] = useState(true);
  const [lastNearbyAt, setLastNearbyAt] = useState<number | null>(null);

  // rota (origem/destino)
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  const mapRef = useRef<MapView | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const watchSubRef = useRef<Location.LocationSubscription | null>(null);
  const nearbyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchTs = useRef(0);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const requestPosOnce = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Permissão de localização negada');
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: coords.latitude, lng: coords.longitude };
  };

  const emitNearbyThrottled = (lat: number, lng: number) => {
    const now = Date.now();
    if (now - lastSearchTs.current < 3000) return;
    lastSearchTs.current = now;
    socketRef.current?.emit('nearby:search', { lat, lng, radiusKm: 10000, limit: 5000 });
  };

  const doNearbyNow = () => region && emitNearbyThrottled(region.latitude, region.longitude);

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

  // PATCH de status da solicitação (com fallback de rota)
  async function patchSolicitacaoStatus(
    id: string,
    status: 'ATRIBUIDA' | 'ABERTA' | 'CANCELADA' | 'CONCLUIDA',
    headers: any
  ) {
    try {
      return await axios.patch(
        `${BASE_URL}/solicitacoes-servicos/by-id/${id}`,
        { status },
        { headers, timeout: 12000 }
      );
    } catch (err: any) {
      if (err?.response?.status !== 404) throw err;
    }
    return await axios.patch(
      `${BASE_URL}/solicitacoes-servicos/${id}`,
      { status },
      { headers, timeout: 12000 }
    );
  }

  // cria atribuição p/ mecânico
  const handleSubmit = async (mechanicId: string) => {
    try {
      if (!mechanicId || !solicitacaoServicoId) {
        Alert.alert('Dados faltando', 'ID do mecânico ou ID da solicitação ausente.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = { mechanicId, solicitacaoServicoId };
      await axios.post(`${BASE_URL}/atribuicoes-servicos`, payload, {
        headers,
        timeout: 15000,
      });

      await patchSolicitacaoStatus(solicitacaoServicoId, 'ATRIBUIDA', headers);

      Alert.alert('Sucesso', 'Serviço atribuído: Solicitação = ATRIBUIDA, Atribuição = PENDENTE.');
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        'Erro ao atribuir o serviço.';
      console.error('Erro ao atribuir o serviço:', error?.response ?? error);
      Alert.alert('Erro', String(msg));
    }
  };

  // abre rota no app de mapas (fallback)
  const openExternalDirections = (dest: LatLng) => {
    const dlat = dest.latitude;
    const dlng = dest.longitude;
    const url =
      Platform.select({
        ios: `maps://?q=Destino&daddr=${dlat},${dlng}`,
        android: `google.navigation:q=${dlat},${dlng}`,
      }) ?? `https://www.google.com/maps/dir/?api=1&destination=${dlat},${dlng}`;
    Linking.openURL(url);
  };

  // traçar rota até o mecânico
  const goToMechanic = (m: NearbyItem) => {
    const dest = { latitude: m.lat, longitude: m.lng };
    if (!origin) {
      Alert.alert('Localização', 'Ainda obtendo sua localização. Tente novamente.');
      return;
    }
    setDestination(dest);

    // centraliza origem+destino
    setTimeout(() => {
      if (mapRef.current && origin) {
        mapRef.current.fitToCoordinates([origin, dest], {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }
    }, 100);
  };

  // limpar rota/painel
  const clearRoute = () => {
    setDestination(null);
    setRouteInfo(null);
  };

  // init
  useEffect(() => {
    (async () => {
      const pos = await requestPosOnce();
      const initial: Region = {
        latitude: pos.lat,
        longitude: pos.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(initial);
      setOrigin({ latitude: pos.lat, longitude: pos.lng });

      const s = connectSocket('location', token);
      socketRef.current = s;

      s.on('connect', () => {
        s.emit('loc:update', { lat: pos.lat, lng: pos.lng, isAvailable: available });
      });

      s.on('mechanic:location', (loc: NearbyItem) => {
        setItems((prev) => {
          const existing = prev.find(item => item.userId === loc.userId);
          if (existing) {
            return prev.map(item =>
              item.userId === loc.userId
                ? { ...item, lat: loc.lat, lng: loc.lng, isAvailable: loc.isAvailable }
                : item
            );
          }
          return [...prev, loc];
        });
      });

      s.on('nearby:result', (data) => {
        setItems(data.items);
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
          setItems(d?.items ?? []);
          setLastNearbyAt(Date.now());
        });
      } else {
        s.on('connect', () => s.emit('loc:update', { lat: pos.lat, lng: pos.lng, isAvailable: available }));
        await startWatcher((lat, lng) => {
          setRegion((prev) =>
            prev
              ? { ...prev, latitude: lat, longitude: lng }
              : { latitude: lat, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }
          );
          setOrigin({ latitude: lat, longitude: lng });
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

  if (!region) {
    return (
      <Screen>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Carregando mapa…</Text>
        </View>
      </Screen>
    );
  }

  // Altura do painel (quando visível)
  const bottomPanelVisible = !!(destination && routeInfo);
  const bottomPanelHeight = bottomPanelVisible ? 2 : 0;

  return (
    <Screen style={{ backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

      {/* Top bar dentro da safe-area */}
      {role === 'MECHANIC' && (
        <View style={styles.topBar}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Disponível</Text>
          <Switch value={available} onValueChange={setAvailable} />
        </View>
      )}

      {role === 'PRODUCER' && (
        <View style={styles.topBar}>
          <Text>
            Mecânicos: {items.length} {lastNearbyAt ? `• ${new Date(lastNearbyAt).toLocaleTimeString()}` : ''}
          </Text>
          {/* {!!solicitacaoServicoId && (
            <Text style={{ marginTop: 4 }}>Solicitação atual: {solicitacaoServicoId}</Text>
          )} */}
          {/* <View style={{ alignSelf: 'flex-start', marginTop: 6 }}> */}
          <TouchableOpacity onPress={doNearbyNow}>
            <Ionicons name='reload' size={24} color='black' />
          </TouchableOpacity>
          {/* </View> */}
        </View>
      )}

      {/* CONTAINER: mapa (flex:1) + painel fixo embaixo */}
      <View style={{ flex: 1 }}>
        {/* o mapa ocupa o espaço restante, menos a altura do painel */}
        <View style={{ flex: 1, marginBottom: bottomPanelHeight }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation
            showsMyLocationButton
            onRegionChangeComplete={() => { }}
          >
            {/* Linha da rota no mapa */}
            {origin && destination && !!GOOGLE_MAPS_APIKEY && (
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={ROUTE_WIDTH}
                strokeColor={ROUTE_COLOR}
                onError={(e) => {
                  console.log('Directions error:', e);
                  setRouteInfo(null);
                  // fallback externo
                  openExternalDirections(destination);
                }}
                onReady={(result) => {
                  // distancia (km) e duração (min)
                  setRouteInfo({
                    distanceKm: result.distance,
                    durationMin: result.duration,
                  });

                  if (mapRef.current && result.coordinates.length > 1) {
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: { top: 80, right: 80, bottom: 160, left: 80 }, // mais espaço embaixo pro painel
                      animated: true,
                    });
                  }
                }}
              />
            )}

            {/* Marcadores dos mecânicos */}
            {role === 'PRODUCER' &&
              items.map((m) => (
                <Marker
                  key={m.userId}
                  coordinate={{ latitude: m.lat, longitude: m.lng }}
                  onPress={() => goToMechanic(m)} // traça rota ao tocar no marcador
                >
                  <Icon name="tools" size={30} color={m.isAvailable ? '#1976D2' : '#BDBDBD'} />
                  <Callout
                    onPress={() => {
                      Alert.alert('Atribuir serviço', `Atribuindo ao mecânico ${m.fullName ?? m.userId}`);
                      handleSubmit(m.userId);
                    }}
                  >
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutText}>Nome: {m.fullName ?? '-'}</Text>
                      <Text style={styles.calloutText}>Especialidade: {m.specialty ?? '-'}</Text>
                      <Text style={styles.calloutText}>Status: {m.isAvailable ? 'Disponível' : 'Indisponível'}</Text>

                      <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.primaryButton]}
                          // onPress={() => goToMechanic(m)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.primaryButtonText}>Exibir Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.primaryButton]}
                          onPress={() => handleSubmit(m.userId)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.primaryButtonText}>Atribuir Serviço</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}


          </MapView>
        </View>

        {/* PAINEL INFERIOR “tipo Uber” (fora do mapa, abaixo dele) */}
        {bottomPanelVisible && (
          <View style={styles.bottomPanel}>
            <View style={styles.bottomRow}>
              <View style={styles.metricPill}>
                <Icon name="road" size={14} color="#030213" style={{ marginRight: 6 }} />
                <Text style={styles.metricText}>{routeInfo!.distanceKm.toFixed(1)} km</Text>
              </View>
              <View style={styles.metricPill}>
                <Icon name="clock" size={14} color="#030213" style={{ marginRight: 6 }} />
                <Text style={styles.metricText}>{Math.round(routeInfo!.durationMin)} min</Text>
              </View>
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity style={[styles.bottomBtn, styles.bottomPrimary]} onPress={() => destination && openExternalDirections(destination!)}>
                <Icon name="location-arrow" size={14} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.bottomPrimaryText}>Iniciar navegação</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.bottomBtn, styles.bottomSecondary]} onPress={clearRoute}>
                <Icon name="times" size={14} color="#0f1020" style={{ marginRight: 8 }} />
                <Text style={styles.bottomSecondaryText}>Limpar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Dialog.Container visible={visible}>
        <Dialog.Title>Confirmação</Dialog.Title>
        <Dialog.Description>Você tem certeza que deseja exibir o perfil?</Dialog.Description>
        <Dialog.Button label="Cancelar" onPress={hideDialog} />
        <Dialog.Button label="Confirmar" onPress={hideDialog} />
      </Dialog.Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00000005',
    borderWidth: 1,
    // borderBottomColor: '#000000ff',
    // borderTopColor: '#000000ff',
    borderColor: '#000000ff',
  },

  calloutContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 240,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  actionButtonsContainer: { paddingTop: 8, gap: 8, alignSelf: 'stretch' },
  actionButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center' },
  primaryButton: { backgroundColor: '#030213' },
  primaryButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },

  // Painel inferior (fora do mapa)
  bottomPanel: {
    height: 120,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eceff3',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f1020',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomPrimary: { backgroundColor: '#030213' },
  bottomPrimaryText: { color: '#fff', fontWeight: '700' },
  bottomSecondary: { backgroundColor: '#f4f5f8', borderWidth: 1, borderColor: '#e6e7ec' },
  bottomSecondaryText: { color: '#0f1020', fontWeight: '700' },
});
