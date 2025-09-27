import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Linking,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
interface Assignment {
  id: string;
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA';
  createdAt: string;
  decidedAt?: string;
  solicitacaoServico: {
    id: string;
    description: string;
    machineType?: string;
    locationLat?: number;
    locationLng?: number;
    status: 'ABERTA' | 'ATRIBUIDA' | 'CANCELADA' | 'CONCLUIDA';
    createdAt: string;
    producer: {
      fullName: string;
      phone?: string;
      email: string;
    };
  };
}

interface User {
  id: string;
  fullName: string;
  role: 'MECHANIC';
  mechanic: {
    specialty: string;
    photoUrl: string;
    isAvailable: boolean;
  };
}

// Mock data
const mockUser: User = {
  id: "mech-1",
  fullName: "João Silva",
  role: "MECHANIC",
  mechanic: {
    specialty: "Tratores e Implementos Agrícolas",
    photoUrl: "",
    isAvailable: true,
  }
};

const mockAssignments: Assignment[] = [
  {
    id: "attr-1",
    status: "PENDENTE",
    createdAt: "2024-01-15T10:30:00Z",
    solicitacaoServico: {
      id: "sol-1",
      description: "Trator John Deere 6600 apresentando problema no motor. Está fazendo ruído estranho durante operação e perdendo potência. Necessário diagnóstico urgente pois é época de colheita.",
      machineType: "Trator",
      locationLat: -23.5505,
      locationLng: -46.6333,
      status: "ATRIBUIDA",
      createdAt: "2024-01-15T09:00:00Z",
      producer: {
        fullName: "Carlos Eduardo Santos",
        phone: "(11) 98765-4321",
        email: "carlos.santos@email.com"
      }
    }
  },
  {
    id: "attr-2", 
    status: "PENDENTE",
    createdAt: "2024-01-15T14:20:00Z",
    solicitacaoServico: {
      id: "sol-2",
      description: "Colheitadeira Case IH com problema na esteira transportadora. Grãos estão caindo durante a colheita. Precisa de reparo rápido.",
      machineType: "Colheitadeira",
      status: "ATRIBUIDA",
      createdAt: "2024-01-15T13:45:00Z",
      producer: {
        fullName: "Maria Oliveira",
        phone: "(11) 99887-6655",
        email: "maria.oliveira@fazenda.com"
      }
    }
  },
  {
    id: "attr-3",
    status: "ACEITA",
    createdAt: "2024-01-14T08:00:00Z",
    decidedAt: "2024-01-14T09:15:00Z",
    solicitacaoServico: {
      id: "sol-3",
      description: "Plantadeira New Holland com problema no sistema de distribuição de sementes. Algumas fileiras não estão plantando corretamente.",
      machineType: "Plantadeira",
      locationLat: -23.6505,
      locationLng: -46.7333,
      status: "ATRIBUIDA",
      createdAt: "2024-01-14T07:30:00Z",
      producer: {
        fullName: "Roberto Ferreira",
        phone: "(11) 97654-3210",
        email: "roberto@agrofazenda.com.br"
      }
    }
  },
  {
    id: "attr-4",
    status: "RECUSADA",
    createdAt: "2024-01-13T16:00:00Z",
    decidedAt: "2024-01-13T17:30:00Z",
    solicitacaoServico: {
      id: "sol-4",
      description: "Pulverizador com bicos entupidos e problema na bomba de pressão.",
      machineType: "Pulverizador",
      status: "ABERTA",
      createdAt: "2024-01-13T15:00:00Z",
      producer: {
        fullName: "Ana Costa",
        phone: "(11) 96543-2109",
        email: "ana.costa@email.com"
      }
    }
  },
  {
    id: "attr-5",
    status: "ACEITA",
    createdAt: "2024-01-12T10:00:00Z",
    decidedAt: "2024-01-12T11:00:00Z",
    solicitacaoServico: {
      id: "sol-5",
      description: "Manutenção preventiva em trator Massey Ferguson 4292. Revisão completa antes da safra.",
      machineType: "Trator",
      status: "CONCLUIDA",
      createdAt: "2024-01-12T09:00:00Z",
      producer: {
        fullName: "Pedro Nascimento",
        phone: "(11) 95432-1098",
        email: "pedro@rural.com"
      }
    }
  }
];

export function MechanicDashboardComplete() {
  // Estados
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Efeitos
  useEffect(() => {
    loadAssignments();
  }, []);

  // Funções
  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      // Aqui você faria a chamada real para a API
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // const response = await fetch(`/api/atribuicoes-servicos?mechanicId=${mockUser.id}`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // const data = await response.json();
        // setAssignments(data);
      }
    } catch (error) {
      console.error('Erro ao carregar atribuições:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptService = async (assignmentId: string) => {
    Alert.alert(
      'Aceitar Serviço',
      'Você tem certeza que deseja aceitar esta solicitação de serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          style: 'default',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              // const response = await fetch(`/api/atribuicoes-servicos/${assignmentId}/aceitar`, {
              //   method: 'PATCH',
              //   headers: { 'Authorization': `Bearer ${token}` }
              // });

              // Simulação local
              setAssignments(prev => 
                prev.map(assignment => 
                  assignment.id === assignmentId 
                    ? { ...assignment, status: "ACEITA", decidedAt: new Date().toISOString() }
                    : assignment
                )
              );
              
              Alert.alert('Sucesso!', 'Serviço aceito com sucesso!');
            } catch (error) {
              console.error('Erro ao aceitar serviço:', error);
              Alert.alert('Erro', 'Não foi possível aceitar o serviço');
            }
          }
        }
      ]
    );
  };

  const handleRejectService = async (assignmentId: string) => {
    Alert.alert(
      'Recusar Serviço',
      'Você tem certeza que deseja recusar esta solicitação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              // const response = await fetch(`/api/atribuicoes-servicos/${assignmentId}/recusar`, {
              //   method: 'PATCH',
              //   headers: { 'Authorization': `Bearer ${token}` }
              // });

              // Simulação local
              setAssignments(prev => 
                prev.map(assignment => 
                  assignment.id === assignmentId 
                    ? { ...assignment, status: "RECUSADA", decidedAt: new Date().toISOString() }
                    : assignment
                )
              );
              
              Alert.alert('Recusado', 'Serviço recusado');
            } catch (error) {
              console.error('Erro ao recusar serviço:', error);
              Alert.alert('Erro', 'Não foi possível recusar o serviço');
            }
          }
        }
      ]
    );
  };

  const handleCallProducer = (phone: string) => {
    Alert.alert(
      'Ligar para Produtor',
      `Deseja ligar para ${phone}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => {
            Linking.openURL(`tel:${phone}`);
          }
        }
      ]
    );
  };

  const handleOpenLocation = (lat: number, lng: number) => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    Linking.openURL(url);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAssignments().finally(() => setRefreshing(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDENTE: '#f97316',
      ACEITA: '#22c55e',
      RECUSADA: '#ef4444',
      CANCELADA: '#6b7280',
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PENDENTE: 'time-outline',
      ACEITA: 'checkmark-circle-outline',
      RECUSADA: 'close-circle-outline',
      CANCELADA: 'alert-circle-outline',
    };
    return icons[status as keyof typeof icons] || 'help-circle-outline';
  };

  // Filtros
  const pendingAssignments = assignments.filter(a => a.status === 'PENDENTE');
  const acceptedAssignments = assignments.filter(a => a.status === 'ACEITA' && a.solicitacaoServico.status !== 'CONCLUIDA');
  const completedAssignments = assignments.filter(a => 
    a.status === 'RECUSADA' || a.status === 'CANCELADA' || a.solicitacaoServico.status === 'CONCLUIDA'
  );

  const getCurrentAssignments = () => {
    switch (activeTab) {
      case 'pending': return pendingAssignments;
      case 'active': return acceptedAssignments;
      case 'completed': return completedAssignments;
      default: return [];
    }
  };

  const showAssignmentDetail = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#030213" />
          <Text style={styles.loadingText}>Carregando serviços...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Painel do Mecânico</Text>
            <Text style={styles.subtitle}>Gerencie suas solicitações</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {mockUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{mockUser.fullName}</Text>
              <Text style={styles.userSpecialty}>{mockUser.mechanic.specialty}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statsScrollView}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={[styles.statCard, styles.pendingCard]}>
          <Ionicons name="time-outline" size={28} color="#f97316" />
          <Text style={styles.statNumber}>{pendingAssignments.length}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>

        <View style={[styles.statCard, styles.activeCard]}>
          <Ionicons name="construct-outline" size={28} color="#3b82f6" />
          <Text style={styles.statNumber}>{acceptedAssignments.length}</Text>
          <Text style={styles.statLabel}>Em Andamento</Text>
        </View>

        <View style={[styles.statCard, styles.completedCard]}>
          <Ionicons name="checkmark-circle-outline" size={28} color="#22c55e" />
          <Text style={styles.statNumber}>{completedAssignments.length}</Text>
          <Text style={styles.statLabel}>Finalizados</Text>
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pendentes
          </Text>
          {pendingAssignments.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingAssignments.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Ativos
          </Text>
          {acceptedAssignments.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{acceptedAssignments.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Finalizados
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {getCurrentAssignments().length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          getCurrentAssignments().map((assignment, index) => (
            <ServiceCard
              key={assignment.id}
              assignment={assignment}
              onAccept={() => handleAcceptService(assignment.id)}
              onReject={() => handleRejectService(assignment.id)}
              onCall={(phone) => handleCallProducer(phone)}
              onOpenLocation={(lat, lng) => handleOpenLocation(lat, lng)}
              onShowDetail={() => showAssignmentDetail(assignment)}
              showActions={activeTab === 'pending'}
              formatDate={formatDate}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              isLast={index === getCurrentAssignments().length - 1}
            />
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      <DetailModal
        visible={showDetailModal}
        assignment={selectedAssignment}
        onClose={() => setShowDetailModal(false)}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />
    </SafeAreaView>
  );
}

// Componentes auxiliares
interface EmptyStateProps {
  activeTab: 'pending' | 'active' | 'completed';
}

function EmptyState({ activeTab }: EmptyStateProps) {
  const getEmptyContent = () => {
    switch (activeTab) {
      case 'pending':
        return {
          icon: 'time-outline',
          title: 'Nenhum serviço pendente',
          subtitle: 'Não há solicitações aguardando sua resposta no momento.',
        };
      case 'active':
        return {
          icon: 'construct-outline',
          title: 'Nenhum serviço ativo',
          subtitle: 'Você não possui serviços em andamento atualmente.',
        };
      case 'completed':
        return {
          icon: 'checkmark-circle-outline',
          title: 'Histórico vazio',
          subtitle: 'Seu histórico de serviços aparecerá aqui.',
        };
    }
  };

  const { icon, title, subtitle } = getEmptyContent();

  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon as any} size={80} color="#e5e7eb" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

interface ServiceCardProps {
  assignment: Assignment;
  onAccept: () => void;
  onReject: () => void;
  onCall: (phone: string) => void;
  onOpenLocation: (lat: number, lng: number) => void;
  onShowDetail: () => void;
  showActions: boolean;
  formatDate: (date: string) => string;
  getStatusIcon: (status: string) => string;
  getStatusColor: (status: string) => string;
  isLast: boolean;
}

function ServiceCard({ 
  assignment, 
  onAccept, 
  onReject, 
  onCall,
  onOpenLocation,
  onShowDetail,
  showActions, 
  formatDate,
  getStatusIcon,
  getStatusColor,
  isLast
}: ServiceCardProps) {
  const { solicitacaoServico } = assignment;

  return (
    <TouchableOpacity 
      style={[styles.serviceCard, isLast && styles.lastCard]} 
      onPress={onShowDetail}
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assignment.status) }]}>
        <Ionicons 
          name={getStatusIcon(assignment.status) as any} 
          size={16} 
          color="#ffffff" 
        />
        <Text style={styles.statusText}>{assignment.status}</Text>
      </View>

      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.machineType}>
          {solicitacaoServico.machineType || 'Equipamento'}
        </Text>
        
        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text style={styles.infoText}>{formatDate(solicitacaoServico.createdAt)}</Text>
          </View>
          {solicitacaoServico.locationLat && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text style={styles.infoText}>Localização</Text>
            </View>
          )}
        </View>
      </View>

      {/* Producer */}
      <View style={styles.producerSection}>
        <View style={styles.producerAvatar}>
          <Text style={styles.producerInitials}>
            {solicitacaoServico.producer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.producerInfo}>
          <Text style={styles.producerName}>{solicitacaoServico.producer.fullName}</Text>
          <Text style={styles.producerContact}>{solicitacaoServico.producer.email}</Text>
        </View>
      </View>

      {/* Description Preview */}
      <Text style={styles.descriptionPreview} numberOfLines={2}>
        {solicitacaoServico.description}
      </Text>

      {/* Actions */}
      {showActions && assignment.status === 'PENDENTE' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
            <Ionicons name="checkmark" size={18} color="#ffffff" />
            <Text style={styles.acceptBtnText}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
            <Ionicons name="close" size={18} color="#ef4444" />
            <Text style={styles.rejectBtnText}>Recusar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contact Actions */}
      {assignment.status === 'ACEITA' && (
        <View style={styles.contactActions}>
          {solicitacaoServico.producer.phone && (
            <TouchableOpacity 
              style={styles.contactBtn} 
              onPress={() => onCall(solicitacaoServico.producer.phone!)}
            >
              <Ionicons name="call" size={16} color="#3b82f6" />
              <Text style={styles.contactBtnText}>Ligar</Text>
            </TouchableOpacity>
          )}
          {solicitacaoServico.locationLat && (
            <TouchableOpacity 
              style={styles.contactBtn} 
              onPress={() => onOpenLocation(solicitacaoServico.locationLat!, solicitacaoServico.locationLng!)}
            >
              <Ionicons name="location" size={16} color="#3b82f6" />
              <Text style={styles.contactBtnText}>Localização</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

interface DetailModalProps {
  visible: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
}

function DetailModal({ 
  visible, 
  assignment, 
  onClose, 
  formatDate, 
  getStatusColor, 
  getStatusIcon 
}: DetailModalProps) {
  if (!assignment) return null;

  const { solicitacaoServico } = assignment;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Detalhes do Serviço</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#030213" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Status */}
          <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(assignment.status) }]}>
            <Ionicons name={getStatusIcon(assignment.status) as any} size={20} color="#ffffff" />
            <Text style={styles.modalStatusText}>{assignment.status}</Text>
          </View>

          {/* Machine Type */}
          <Text style={styles.modalMachineType}>
            {solicitacaoServico.machineType || 'Equipamento não especificado'}
          </Text>

          {/* Dates */}
          <View style={styles.modalInfoGrid}>
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalInfoLabel}>Solicitado em:</Text>
              <Text style={styles.modalInfoValue}>{formatDate(solicitacaoServico.createdAt)}</Text>
            </View>
            {assignment.decidedAt && (
              <View style={styles.modalInfoItem}>
                <Text style={styles.modalInfoLabel}>Decidido em:</Text>
                <Text style={styles.modalInfoValue}>{formatDate(assignment.decidedAt)}</Text>
              </View>
            )}
          </View>

          {/* Producer Details */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Produtor</Text>
            <View style={styles.modalProducerCard}>
              <View style={styles.modalProducerAvatar}>
                <Text style={styles.modalProducerInitials}>
                  {solicitacaoServico.producer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
              <View style={styles.modalProducerInfo}>
                <Text style={styles.modalProducerName}>{solicitacaoServico.producer.fullName}</Text>
                <Text style={styles.modalProducerContact}>{solicitacaoServico.producer.email}</Text>
                {solicitacaoServico.producer.phone && (
                  <Text style={styles.modalProducerContact}>{solicitacaoServico.producer.phone}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Descrição do Problema</Text>
            <Text style={styles.modalDescription}>{solicitacaoServico.description}</Text>
          </View>

          {/* Location */}
          {solicitacaoServico.locationLat && solicitacaoServico.locationLng && (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Localização</Text>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => {
                  const url = `https://maps.google.com/?q=${solicitacaoServico.locationLat},${solicitacaoServico.locationLng}`;
                  Linking.openURL(url);
                }}
              >
                <Ionicons name="location" size={20} color="#3b82f6" />
                <Text style={styles.locationButtonText}>Abrir no Maps</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#030213',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#030213',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
  },
  userSpecialty: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  statsScrollView: {
    paddingVertical: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  statCard: {
    width: 120,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  pendingCard: {
    backgroundColor: '#fff7ed',
  },
  activeCard: {
    backgroundColor: '#eff6ff',
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#030213',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#030213',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#030213',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastCard: {
    marginBottom: 40,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardHeader: {
    marginBottom: 16,
    paddingRight: 80,
  },
  machineType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#030213',
    marginBottom: 8,
  },
  cardInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  producerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  producerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  producerInitials: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  producerInfo: {
    flex: 1,
  },
  producerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 2,
  },
  producerContact: {
    fontSize: 12,
    color: '#6b7280',
  },
  descriptionPreview: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#030213',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalMachineType: {
    fontSize: 24,
    fontWeight: '700',
    color: '#030213',
    marginBottom: 20,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  modalInfoItem: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#030213',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 12,
  },
  modalProducerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  modalProducerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalProducerInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalProducerInfo: {
    flex: 1,
  },
  modalProducerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 4,
  },
  modalProducerContact: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
});