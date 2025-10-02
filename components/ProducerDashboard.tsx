import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');
import { useAuth } from '../src/store/auth';
import { api } from '../src/lib/api';
import { useRouter } from 'expo-router';

interface ServiceRequest {
  id: string;
  machineType: string;
  description: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  assignedMechanic?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

interface ProducerDashBoardProps {
  token: string;
}

export default function ProducerDashboard({ token }: ProducerDashBoardProps) {
  const { user, signOut, rehydrate } = useAuth();  // Pega o token e user do Zustand
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    rehydrate();  // Reidrata o estado global para garantir que o token esteja disponível
  }, [rehydrate]);

  // Usar o efeito para garantir que as solicitações sejam carregadas assim que o userId estiver disponível
  useEffect(() => {
    if (user?.id) {  // Agora verificamos se o userId está disponível antes de carregar as solicitações
      loadServiceRequests(user.id);
    }
  }, [user?.id]);  // Esse efeito será executado sempre que o user.id mudar

  const loadServiceRequests = async (userId: string) => {
    setLoading(true);

    if (userId) {
      try {
        const response = await api(`/solicitacoes-servicos/${userId}`, {
          method: 'GET',
        });

        const data = response;  // Aqui você assume que a API retorna um campo 'data'
        console.log('Solicitações de serviço recebidas:', data);

        setServiceRequests(data);

        // Atualizando as estatísticas
        const newStats = {
          total: data.length,
          pending: data.filter((request: ServiceRequest) => request.status === 'PENDING').length,
          inProgress: data.filter((request: ServiceRequest) => request.status === 'IN_PROGRESS' || request.status === 'ASSIGNED').length,
          completed: data.filter((request: ServiceRequest) => request.status === 'COMPLETED').length,
        };

        setStats(newStats);
      } catch (error) {
        console.error('Erro ao buscar as solicitações:', error);
      }
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await loadServiceRequests(user.id);  // Faz a requisição com o userId
    } else {
      console.log('ID do usuário não encontrado. Não foi possível atualizar.');
    }
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'ASSIGNED': return '#2196F3';
      case 'IN_PROGRESS': return '#FF9800';
      case 'COMPLETED': return '#4CAF50';
      case 'CANCELLED': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'ASSIGNED': return 'Atribuído';
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onSubmitNewService = async () => {
    router.push('/(tabs)/serviceselection');
  };

  const onSubmitMechanic = async () => {
    router.push('/(tabs)/map');
  };

  const handleViewDetails = (request: ServiceRequest) => {
    Alert.alert(
      'Detalhes da Solicitação',
      `Equipamento: ${request.machineType}\nDescrição: ${request.description}\nStatus: ${getStatusText(request.status)}\nCriado em: ${formatDate(request.createdAt)}${request.assignedMechanic ? `\nMecânico: ${request.assignedMechanic}` : ''}`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Bem-vindo, {user?.fullName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onSubmitNewService}>
            <Text style={styles.primaryButtonText}>Nova Solicitação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={onSubmitMechanic}>
            <Text style={styles.secondaryButtonText}>Ver Mecânicos no Mapa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stats.total}</Text>
            <Text style={styles.statsLabel}>Total</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={[styles.statsNumber, { color: '#FFA500' }]}>{stats.pending}</Text>
            <Text style={styles.statsLabel}>Pendentes</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={[styles.statsNumber, { color: '#FF9800' }]}>{stats.inProgress}</Text>
            <Text style={styles.statsLabel}>Em Andamento</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={[styles.statsNumber, { color: '#4CAF50' }]}>{stats.completed}</Text>
            <Text style={styles.statsLabel}>Concluídos</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Suas Solicitações</Text>

          {serviceRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma solicitação encontrada</Text>
              <Text style={styles.emptyStateSubtext}>Toque em "Nova Solicitação" para começar</Text>
            </View>
          ) : (
            serviceRequests.map((request) => (
              <TouchableOpacity key={request.id} style={styles.requestCard} onPress={() => handleViewDetails(request)}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestMachine}>{request.machineType}</Text>
                  <View style={styles.requestBadges}>
                    <View style={[styles.priorityBadge, { backgroundColor: getStatusColor(request.priority) }]}>
                      <Text style={styles.priorityText}>{request.priority}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.requestDescription} numberOfLines={2}>
                  {request.description}
                </Text>

                <View style={styles.requestFooter}>
                  <Text style={styles.requestDate}>{formatDate(request.createdAt)}</Text>
                  {request.assignedMechanic && <Text style={styles.requestMechanic}>Mecânico: {request.assignedMechanic}</Text>}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666666' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#030213' },
  headerSubtitle: { fontSize: 14, color: '#717182', marginTop: 2 },
  logoutButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f3f3f5', borderRadius: 8 },
  logoutButtonText: { fontSize: 14, color: '#030213' },
  scrollView: { flex: 1 },
  actionButtonsContainer: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  actionButton: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center' },
  primaryButton: { backgroundColor: '#030213' },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  secondaryButton: { backgroundColor: '#f3f3f5', borderWidth: 1, borderColor: '#e0e0e0' },
  secondaryButtonText: { fontSize: 16, color: '#030213' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  statsCard: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, alignItems: 'center' },
  statsNumber: { fontSize: 24, fontWeight: '700', color: '#030213' },
  statsLabel: { fontSize: 12, color: '#717182', marginTop: 4 },
  sectionContainer: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#030213', marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 16, color: '#717182' },
  emptyStateSubtext: { fontSize: 14, color: '#a0a0a0' },
  requestCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  requestMachine: { fontSize: 16, fontWeight: '600', color: '#030213' },
  requestBadges: { flexDirection: 'row', gap: 6 },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityText: { fontSize: 10, fontWeight: '600', color: '#ffffff' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '500', color: '#ffffff' },
  requestDescription: { fontSize: 14, color: '#717182', marginBottom: 12 },
  requestFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestDate: { fontSize: 12, color: '#a0a0a0' },
  requestMechanic: { fontSize: 12, color: '#030213' },
});
