import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Modal,
  Pressable,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Screen } from './layout/Screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../src/store/auth';
import { api } from '../src/lib/api';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
// Se você já usa esse helper no Map, reutilize o mesmo caminho:
import { connectSocket } from '../src/lib/socket'; // ajuste o caminho se necessário
import type { Socket } from 'socket.io-client';

const { width } = Dimensions.get('window');

type FrontStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type BackStatus = 'ABERTA' | 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | string;

interface ServiceRequest {
  id: string;
  machineType: string;
  description: string;
  status: FrontStatus;
  createdAt: string;
  assignedMechanic?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

interface ProducerDashBoardProps { token: string; }

const POLL_INTERVAL_MS = 10000; // 10s

export default function ProducerDashboard({ token }: ProducerDashBoardProps) {
  const router = useRouter();
  const { user, signOut, rehydrate } = useAuth();

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [modalRefreshing, setModalRefreshing] = useState(false);

  // refs para efeitos de ciclo de vida
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => { rehydrate(); }, [rehydrate]);

  // ======== Normalização de status do BACK -> FRONT ========
  const mapStatus = (s: BackStatus): FrontStatus => {
    switch (s) {
      case 'ABERTA': return 'PENDING';        // aberta
      case 'ATRIBUIDA': return 'ASSIGNED';    // atribuída (pendente/aceita depende do assignedMechanic)
      case 'EM_ANDAMENTO': return 'IN_PROGRESS';
      case 'CONCLUIDA': return 'COMPLETED';
      case 'CANCELADA': return 'CANCELLED';
      default:
        if (['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(String(s))) {
          return s as FrontStatus;
        }
        return 'PENDING';
    }
  };

  // Normaliza a resposta do back para o tipo ServiceRequest do front
  const normalizeRequests = (raw: any[]): ServiceRequest[] => {
    return (raw ?? []).map((r: any) => {
      // assignedMechanic virá preenchido apenas quando ACEITA (segundo seu contrato);
      // enquanto não aceitou: status = ATRIBUIDA, assignedMechanic = null
      const fallbackAssigned =
        r?.assignments?.[0]?.mechanic?.fullName ??
        r?.assignments?.[0]?.mechanic?.name ??
        null;

      const assignedName =
        (r?.assignedMechanic ?? fallbackAssigned ?? null) as string | null;

      return {
        id: String(r.id),
        machineType: r.machineType ?? '',
        description: r.description ?? '',
        createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(r.createdAt).toISOString(),
        status: mapStatus(r.status as BackStatus),
        assignedMechanic: assignedName,
        priority: (r.priority ?? 'MEDIUM') as ServiceRequest['priority'],
      };
    });
  };

  const sortRequests = (list: ServiceRequest[]) => {
    const rank = (s: FrontStatus) =>
      s === 'PENDING' ? 0 :
        s === 'ASSIGNED' ? 1 :
          s === 'IN_PROGRESS' ? 2 :
            s === 'COMPLETED' ? 3 : 4;
    return [...list].sort((a, b) => rank(a.status) - rank(b.status));
  };

  const computeStats = (data: ServiceRequest[]) => ({
    total: data.length,
    pending: data.filter(r => r.status === 'PENDING').length,
    inProgress: data.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length,
    completed: data.filter(r => r.status === 'COMPLETED').length,
  });

  // Busca do back (use a rota que você padronizou — deixei /user/:id pois você usou nessa versão)
  const fetchRequestsForUser = async (userId: string): Promise<ServiceRequest[]> => {
    const response = await api(`/solicitacoes-servicos/user/${userId}`, { method: 'GET' });
    const normalized = normalizeRequests(response);
    return sortRequests(normalized);
  };

  const syncNow = useCallback(async (reason: string) => {
    if (!user?.id) return;
    try {
      // para evitar flicker quando atualiza em segundo plano
      if (reason === 'manual' || reason === 'focus' || reason === 'socket') {
        // ok manter loading=false; somente refreshing/modalRefreshing gerenciam UI
      }
      const list = await fetchRequestsForUser(user.id);
      setServiceRequests(list);
      setStats(computeStats(list));
      // mantém item selecionado atualizado
      if (selected) {
        const found = list.find(r => r.id === selected.id);
        if (found) setSelected(found);
      }
    } catch (e) {
      console.error(`[Dashboard] Erro no sync (${reason}):`, e);
    }
  }, [user?.id, selected]);

  // 1) Carrega inicial
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      await syncNow('initial');
      setLoading(false);
    })();
  }, [user?.id, syncNow]);

  // 2) Atualiza ao voltar para a tela (focus)
  useFocusEffect(
    useCallback(() => {
      syncNow('focus');
      return () => { };
    }, [syncNow])
  );

  // 3) Atualiza quando o app volta para foreground (AppState)
  useEffect(() => {
    const onChange = (nextState: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;
      if (prev.match(/inactive|background/) && nextState === 'active') {
        syncNow('appstate');
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [syncNow]);

  // 4) Polling leve a cada 10s
  useEffect(() => {
    if (!user?.id) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      syncNow('poll');
    }, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user?.id, syncNow]);

  // 5) Socket (tempo real) — reage a eventos do back
  useEffect(() => {
    if (!token || !user?.id) return;

    const s = connectSocket('updates', token); // namespace "updates" — alinhe com o back
    socketRef.current = s;

    s.on('connect', () => {
      // junte o usuário em uma sala se seu back suportar
      s.emit('room:join', { userId: user.id, role: 'PRODUCER' });
    });

    // Eventos comuns (ajuste aos nomes que o seu servidor emitir)
    const handler = (evt: any) => {
      // evt pode conter solicitacaoId / producerId / etc.; se for do usuário, sincroniza
      syncNow('socket');
    };

    s.on('solicitacao:created', handler);
    s.on('solicitacao:updated', handler);
    s.on('solicitacao:status', handler);
    s.on('atribuicao:created', handler);
    s.on('atribuicao:updated', handler);
    s.on('atribuicao:aceita', handler);
    s.on('atribuicao:recusada', handler);
    s.on('atribuicao:cancelada', handler);

    return () => {
      s.emit('room:leave', { userId: user.id });
      s.disconnect();
      socketRef.current = null;
    };
  }, [token, user?.id, syncNow]);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncNow('manual');
    setRefreshing(false);
  };

  const reloadOnlySelected = async () => {
    if (!selected) return;
    try {
      setModalRefreshing(true);
      await syncNow('manual');
    } finally {
      setModalRefreshing(false);
    }
  };

  // ✅ ação que vai para o MAPA com o solicitacaoServicoId
  const onAssignMechanic = (request: ServiceRequest) => {
    router.push({
      pathname: '/(tabs)/map',
      params: { solicitacaoServicoId: request.id },
    });
  };

  // ========= Helpers de estado =========
  const hasAssigned = (r: ServiceRequest) =>
    (r.assignedMechanic ?? '').toString().trim().length > 0;

  // ATRIBUIDA, mas aguardando aceite (sem mecânico aceito)
  const isAwaitingAcceptance = (r: ServiceRequest) =>
    r.status === 'ASSIGNED' && !hasAssigned(r);

  const isLocked = (r: ServiceRequest) =>
    r.status === 'COMPLETED' || r.status === 'CANCELLED';

  // Só pode atribuir quando está ABERTA (PENDING)
  const isAssignable = (r: ServiceRequest) => r.status === 'PENDING';

  // “Ver no mapa” quando já tem mecânico aceito OU está em andamento
  const isMapOnly = (r: ServiceRequest) =>
    hasAssigned(r) || r.status === 'IN_PROGRESS';

  // Meta helpers (cores + rótulos + ícones)
  const getStatusMeta = (r: ServiceRequest) => {
    const status = r.status;
    const awaiting = isAwaitingAcceptance(r);

    switch (status) {
      case 'PENDING':
        return { color: '#FFA500', label: 'Aberta', icon: 'folder-open' };
      case 'ASSIGNED':
        return awaiting
          ? { color: '#2196F3', label: 'Atribuída (pendente)', icon: 'hourglass-half' }
          : { color: '#2196F3', label: 'Atribuída', icon: 'user' };
      case 'IN_PROGRESS':
        return { color: '#FF9800', label: 'Em andamento', icon: 'play' };
      case 'COMPLETED':
        return { color: '#4CAF50', label: 'Concluída', icon: 'check-circle' };
      case 'CANCELLED':
        return { color: '#F44336', label: 'Cancelada', icon: 'times-circle' };
      default:
        return { color: '#757575', label: status, icon: 'info-circle' };
    }
  };

  const getPriorityMeta = (p: ServiceRequest['priority']) => {
    switch (p) {
      case 'URGENT': return { color: '#E53935', label: 'URGENTE', icon: 'exclamation-triangle' };
      case 'HIGH': return { color: '#FB8C00', label: 'ALTA', icon: 'arrow-up' };
      case 'MEDIUM': return { color: '#FDD835', label: 'MÉDIA', icon: 'minus' };
      case 'LOW': return { color: '#43A047', label: 'BAIXA', icon: 'arrow-down' };
      default: return { color: '#9E9E9E', label: p, icon: 'tag' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const openDetails = (request: ServiceRequest) => { setSelected(request); setModalVisible(true); };
  const closeDetails = () => { setModalVisible(false); setSelected(null); };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}><Text style={styles.loadingText}>Carregando...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <Screen scroll>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Bem-vindo, {user?.fullName}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Ações rápidas */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={() => router.push('/(tabs)/serviceselection')}>
              <Text style={styles.primaryButtonText}>Nova Solicitação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.secondaryButtonText}>Ver Mecânicos no Mapa</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View className="statsCard" style={styles.statsCard}>
              <Text style={styles.statsNumber}>{stats.total}</Text>
              <Text style={styles.statsLabel}>Total</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={[styles.statsNumber, { color: '#FFA500' }]}>{stats.pending}</Text>
              <Text style={styles.statsLabel}>Abertas</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={[styles.statsNumber, { color: '#FF9800' }]}>{stats.inProgress}</Text>
              <Text style={styles.statsLabel}>Atribuídas</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={[styles.statsNumber, { color: '#4CAF50' }]}>{stats.completed}</Text>
              <Text style={styles.statsLabel}>Concluídas</Text>
            </View>
          </View>

          {/* Lista */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Suas Solicitações</Text>

            {serviceRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhuma solicitação encontrada</Text>
                <Text style={styles.emptyStateSubtext}>Toque em "Nova Solicitação" para começar</Text>
              </View>
            ) : (
              serviceRequests.map((r) => {
                const p = getPriorityMeta(r.priority);
                const s = getStatusMeta(r);
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => openDetails(r)}
                    android_ripple={{ color: '#eaeaf1' }}
                    style={({ pressed }) => [styles.requestCard, { opacity: pressed ? 0.96 : 1 }]}
                  >
                    {/* Faixa de prioridade */}
                    <View style={[styles.priorityStripe, { backgroundColor: p.color }]} />

                    <View style={styles.requestContent}>
                      <View style={styles.requestHeader}>
                        <Text style={styles.requestMachine}>{r.machineType}</Text>

                        <View style={styles.badgesRow}>
                          <View style={[styles.badge, { backgroundColor: p.color + '22', borderColor: p.color }]}>
                            <Icon name={p.icon} size={12} style={{ marginRight: 6 }} color={p.color} />
                            <Text style={[styles.badgeText, { color: p.color }]}>{p.label}</Text>
                          </View>
                          <View style={[styles.badge, { backgroundColor: s.color + '22', borderColor: s.color }]}>
                            <Icon name={s.icon} size={12} style={{ marginRight: 6 }} color={s.color} />
                            <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                          </View>
                        </View>
                      </View>

                      <Text numberOfLines={2} style={styles.requestDescription}>{r.description}</Text>

                      {!!hasAssigned(r) && (
                        <View style={[styles.assignedPill, { backgroundColor: s.color + '12', borderColor: s.color }]}>
                          <Icon name="user" size={12} color={s.color} style={{ marginRight: 6 }} />
                          <Text style={[styles.assignedPillText, { color: s.color }]}>
                            Atribuída para {r.assignedMechanic}
                          </Text>
                        </View>
                      )}

                      {/* Rodapé do card com Atribuir + Detalhes / Ver no mapa */}
                      <View style={styles.requestFooter}>
                        <Text style={styles.requestDate}>{formatDate(r.createdAt)}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          {isAssignable(r) ? (
                            <TouchableOpacity
                              style={styles.assignButton}
                              onPress={() => onAssignMechanic(r)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.assignButtonText}>Atribuir Mecânico</Text>
                            </TouchableOpacity>
                          ) : isMapOnly(r) ? (
                            <TouchableOpacity
                              style={[styles.detailsChip, { backgroundColor: '#030213' }]}
                              onPress={() => onAssignMechanic(r)}
                              activeOpacity={0.8}
                            >
                              <Icon name="map-marked-alt" size={12} color="#fff" style={{ marginRight: 6 }} />
                              <Text style={[styles.detailsChipText, { color: '#fff' }]}>Ver no Mapa</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity style={styles.detailsChip} onPress={() => openDetails(r)} activeOpacity={0.8}>
                              <Icon name="info-circle" size={12} color="#030213" style={{ marginRight: 6 }} />
                              <Text style={styles.detailsChipText}>Detalhes</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* MODAL DE DETALHES */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeDetails}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.backdropTouch} onPress={closeDetails} />
          <View style={styles.modalCard}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalhes da Solicitação</Text>
                  <TouchableOpacity onPress={closeDetails} hitSlop={10}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
                </View>

                {/* Chips com ícones no topo */}
                <View style={styles.modalChipsRow}>
                  {(() => {
                    const p = getPriorityMeta(selected.priority);
                    return (
                      <View style={[styles.badge, styles.modalBadge, { backgroundColor: p.color + '22', borderColor: p.color }]}>
                        <Icon name={p.icon} size={12} style={{ marginRight: 6 }} color={p.color} />
                        <Text style={[styles.badgeText, { color: p.color }]}>{p.label}</Text>
                      </View>
                    );
                  })()}
                  {(() => {
                    const s = getStatusMeta(selected);
                    return (
                      <View style={[styles.badge, styles.modalBadge, { backgroundColor: s.color + '22', borderColor: s.color }]}>
                        <Icon name={s.icon} size={12} style={{ marginRight: 6 }} color={s.color} />
                        <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                      </View>
                    );
                  })()}
                </View>

                <ScrollView
                  style={styles.modalBody}
                  refreshControl={<RefreshControl refreshing={modalRefreshing} onRefresh={reloadOnlySelected} />}
                >
                  <Row icon="cogs" label="Equipamento" value={selected.machineType} />
                  <Row icon="align-left" label="Descrição" value={selected.description} multiline />
                  <Row icon="calendar" label="Criado em" value={formatDate(selected.createdAt)} />
                  {hasAssigned(selected) && <Row icon="user" label="Mecânico" value={selected.assignedMechanic!} />}
                </ScrollView>

                {/* Ações do modal */}
                <View style={styles.modalActions}>
                  {isAssignable(selected) && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalPrimary]}
                      onPress={() => { closeDetails(); onAssignMechanic(selected); }}
                    >
                      <Icon name="user-plus" size={16} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.modalPrimaryText}>Atribuir Mecânico</Text>
                    </TouchableOpacity>
                  )}

                  {isMapOnly(selected) && !isLocked(selected) && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalPrimary]}
                      onPress={() => { closeDetails(); onAssignMechanic(selected); }}
                    >
                      <Icon name="map-marked-alt" size={16} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.modalPrimaryText}>Ver no Mapa</Text>
                    </TouchableOpacity>
                  )}

                  {isLocked(selected) && (
                    <View style={[styles.modalButton, styles.modalSecondary]}>
                      <Icon
                        name={selected.status === 'COMPLETED' ? 'check-circle' : 'times-circle'}
                        size={16}
                        color="#0f1020"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.modalSecondaryText}>
                        {selected.status === 'COMPLETED' ? 'Solicitação Concluída' : 'Solicitação Cancelada'}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity style={[styles.modalButton, styles.modalSecondary]} onPress={closeDetails}>
                    <Icon name="times" size={16} color="#0f1020" style={{ marginRight: 8 }} />
                    <Text style={styles.modalSecondaryText}>Fechar</Text>
                  </TouchableOpacity>
                </View>

              </>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

/** linha label/valor com ícone opcional */
function Row({ label, value, multiline, icon }: { label: string; value: string; multiline?: boolean; icon?: string }) {
  if (!value) return null;
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, color: '#717182', marginBottom: 4 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {!!icon && <Icon name={icon} size={14} color="#1e1e26" style={{ marginRight: 8, marginTop: 2 }} />}
        <Text style={{ fontSize: 15, color: '#1e1e26', flex: 1 }} numberOfLines={multiline ? 6 : 3}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666666' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#030213' },
  headerSubtitle: { fontSize: 14, color: '#717182', marginTop: 2 },
  logoutButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f3f3f5', borderRadius: 8 },
  logoutButtonText: { fontSize: 14, color: '#030213' },

  scrollView: { flex: 1 },

  actionButtonsContainer: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  actionButton: {
    paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
  },
  primaryButton: { backgroundColor: '#030213' },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  secondaryButton: { backgroundColor: '#f3f3f5', borderWidth: 1, borderColor: '#e0e0e0' },
  secondaryButtonText: { fontSize: 16, color: '#030213' },

  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  statsCard: {
    flex: 1, backgroundColor: '#f8f9fa', padding: 8, borderRadius: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#eceff3',
  },
  statsNumber: { fontSize: 24, fontWeight: '700', color: '#030213' },
  statsLabel: { fontSize: 12, color: '#717182', marginTop: 4 },

  sectionContainer: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#030213', marginBottom: 16 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 16, color: '#717182' },
  emptyStateSubtext: { fontSize: 14, color: '#a0a0a0' },

  requestCard: {
    flexDirection: 'row', backgroundColor: '#ffffff',
    borderWidth: 1, borderColor: '#e6e7ec', borderRadius: 14,
    overflow: 'hidden', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  priorityStripe: { width: 6 },
  requestContent: { flex: 1, padding: 14 },

  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' },
  requestMachine: { fontSize: 16, fontWeight: '700', color: '#0f1020' },

  badgesRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  requestDescription: { fontSize: 14, color: '#616277', marginBottom: 8 },

  assignedPill: {
    alignSelf: 'flex-start', marginBottom: 8,
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 999, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center',
  },
  assignedPillText: { fontSize: 12, fontWeight: '600' },

  requestFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestDate: { fontSize: 12, color: '#9aa0ad' },

  // Botão "Atribuir"
  assignButton: {
    backgroundColor: '#030213',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  detailsChip: {
    backgroundColor: '#f3f3f5',
    borderWidth: 1, borderColor: '#e0e0e0',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row', alignItems: 'center',
  },
  detailsChipText: { color: '#030213', fontWeight: '700', fontSize: 12 },

  // MODAL
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(3,3,20,0.32)' },
  backdropTouch: { flex: 1 },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20,
    borderWidth: 1, borderColor: '#eceff3',
    maxHeight: '90%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f1020' },
  modalClose: { fontSize: 20, color: '#8c8ea1' },

  modalChipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  modalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  modalBody: { marginTop: 10 },

  modalActions: { marginTop: 14, gap: 10 },
  modalButton: {
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center',
  },
  modalPrimary: { backgroundColor: '#030213' },
  modalPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalSecondary: { backgroundColor: '#f4f5f8', borderWidth: 1, borderColor: '#e6e7ec' },
  modalSecondaryText: { color: '#0f1020', fontWeight: '700', fontSize: 16 },
});
