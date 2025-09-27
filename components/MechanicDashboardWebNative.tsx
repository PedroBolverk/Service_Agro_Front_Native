import React, { useState, useEffect } from "react";

interface ServiceAssignment {
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
    scheduledFor?: string;
    status: 'ABERTA' | 'ATRIBUIDA' | 'CANCELADA' | 'CONCLUIDA';
    createdAt: string;
    producer: {
      fullName: string;
      phone?: string;
      email: string;
    };
  };
}

export function MechanicDashboardWebNative() {
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [refreshing, setRefreshing] = useState(false);

  // Mock user data - replace with actual auth
  const user = {
    id: "mock-mechanic-id",
    fullName: "João Silva",
    role: "MECHANIC",
    mechanic: {
      specialty: "Tratores e Implementos"
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockAssignments: ServiceAssignment[] = [
        {
          id: "1",
          status: "PENDENTE",
          createdAt: new Date().toISOString(),
          solicitacaoServico: {
            id: "req-1",
            description: "Problema no motor do trator, fazendo ruído estranho e perdendo potência durante o trabalho.",
            machineType: "Trator",
            status: "ABERTA",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            producer: {
              fullName: "Maria Santos",
              phone: "(11) 98765-4321",
              email: "maria@fazenda.com"
            }
          }
        },
        {
          id: "2",
          status: "ACEITA",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          solicitacaoServico: {
            id: "req-2",
            description: "Colheitadeira com problema na esteira de grãos, não está funcionando corretamente.",
            machineType: "Colheitadeira",
            status: "ATRIBUIDA",
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            producer: {
              fullName: "Pedro Oliveira",
              phone: "(11) 99876-5432",
              email: "pedro@agro.com"
            }
          }
        }
      ];
      
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Erro ao buscar atribuições:', error);
      alert('Erro ao carregar serviços');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAcceptService = async (assignmentId: string) => {
    try {
      // Mock API call
      alert('Serviço aceito com sucesso!');
      fetchAssignments();
    } catch (error) {
      alert('Erro ao aceitar serviço');
    }
  };

  const handleRejectService = async (assignmentId: string) => {
    if (confirm('Tem certeza que deseja recusar este serviço?')) {
      try {
        alert('Serviço recusado');
        fetchAssignments();
      } catch (error) {
        alert('Erro ao recusar serviço');
      }
    }
  };

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
    switch (status) {
      case 'PENDENTE': return '#f59e0b';
      case 'ACEITA': return '#10b981';
      case 'RECUSADA': return '#ef4444';
      case 'CANCELADA': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'ACEITA': return 'Aceito';
      case 'RECUSADA': return 'Recusado';
      case 'CANCELADA': return 'Cancelado';
      default: return status;
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === 'PENDENTE');
  const acceptedAssignments = assignments.filter(a => a.status === 'ACEITA');
  const completedAssignments = assignments.filter(a => 
    a.status === 'RECUSADA' || a.status === 'CANCELADA' || a.solicitacaoServico.status === 'CONCLUIDA'
  );

  const renderServiceCard = (assignment: ServiceAssignment, showActions: boolean = false) => (
    <div key={assignment.id} style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitleRow}>
          <div style={styles.cardTitle}>
            {assignment.solicitacaoServico.machineType || 'Equipamento não especificado'}
          </div>
          <div style={{...styles.statusBadge, backgroundColor: getStatusColor(assignment.status)}}>
            <span style={styles.statusText}>{getStatusText(assignment.status)}</span>
          </div>
        </div>
        <div style={styles.dateText}>
          📅 {formatDate(assignment.solicitacaoServico.createdAt)}
        </div>
        {assignment.solicitacaoServico.locationLat && (
          <div style={styles.locationText}>📍 Localização disponível</div>
        )}
      </div>

      <div style={styles.cardContent}>
        {/* Producer Info */}
        <div style={styles.producerInfo}>
          <div style={styles.avatar}>
            <span style={styles.avatarText}>
              {assignment.solicitacaoServico.producer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div style={styles.producerDetails}>
            <div style={styles.producerName}>{assignment.solicitacaoServico.producer.fullName}</div>
            <div style={styles.producerContact}>
              {assignment.solicitacaoServico.producer.phone || assignment.solicitacaoServico.producer.email}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={styles.descriptionSection}>
          <div style={styles.sectionTitle}>Descrição do Problema</div>
          <div style={styles.descriptionText}>
            {assignment.solicitacaoServico.description}
          </div>
        </div>

        {/* Actions */}
        {showActions && assignment.status === 'PENDENTE' && (
          <div style={styles.actionsRow}>
            <button 
              style={{...styles.actionButton, ...styles.acceptButton}}
              onClick={() => handleAcceptService(assignment.id)}
            >
              ✓ Aceitar
            </button>
            <button 
              style={{...styles.actionButton, ...styles.rejectButton}}
              onClick={() => handleRejectService(assignment.id)}
            >
              ✗ Recusar
            </button>
          </div>
        )}

        {/* Contact Actions */}
        {assignment.status === 'ACEITA' && (
          <div style={styles.actionsRow}>
            <button style={{...styles.actionButton, ...styles.contactButton}}>
              💬 Conversar
            </button>
            {assignment.solicitacaoServico.locationLat && (
              <button style={{...styles.actionButton, ...styles.contactButton}}>
                📍 Ver Local
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    let data: ServiceAssignment[] = [];
    let emptyMessage = '';

    switch (activeTab) {
      case 'pending':
        data = pendingAssignments;
        emptyMessage = 'Nenhum serviço pendente';
        break;
      case 'active':
        data = acceptedAssignments;
        emptyMessage = 'Nenhum serviço em andamento';
        break;
      case 'completed':
        data = completedAssignments;
        emptyMessage = 'Nenhum serviço finalizado';
        break;
    }

    if (data.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateTitle}>{emptyMessage}</div>
          <div style={styles.emptyStateSubtitle}>
            {activeTab === 'pending' 
              ? 'Você não possui solicitações aguardando resposta.'
              : activeTab === 'active'
              ? 'Você não possui serviços aceitos atualmente.'
              : 'Seu histórico de serviços aparecerá aqui.'
            }
          </div>
        </div>
      );
    }

    return (
      <div>
        {data.map(assignment => renderServiceCard(assignment, activeTab === 'pending'))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Refresh indicator */}
      {refreshing && (
        <div style={styles.refreshIndicator}>
          Atualizando...
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Painel do Mecânico</div>
          <div style={styles.subtitle}>Gerencie suas solicitações de serviço</div>
        </div>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            <span style={styles.avatarText}>
              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div style={styles.userName}>{user.fullName}</div>
            <div style={styles.userRole}>{user.mechanic?.specialty}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{pendingAssignments.length}</div>
          <div style={styles.statLabel}>Pendentes</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{acceptedAssignments.length}</div>
          <div style={styles.statLabel}>Em Andamento</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{completedAssignments.length}</div>
          <div style={styles.statLabel}>Finalizados</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'pending' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('pending')}
        >
          <span style={{...styles.tabText, ...(activeTab === 'pending' ? styles.activeTabText : {})}}>
            Pendentes ({pendingAssignments.length})
          </span>
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'active' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('active')}
        >
          <span style={{...styles.tabText, ...(activeTab === 'active' ? styles.activeTabText : {})}}>
            Andamento ({acceptedAssignments.length})
          </span>
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'completed' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('completed')}
        >
          <span style={{...styles.tabText, ...(activeTab === 'completed' ? styles.activeTabText : {})}}>
            Finalizados ({completedAssignments.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxHeight: '100vh',
    overflow: 'auto',
  },
  refreshIndicator: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: 1000,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    paddingTop: '60px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#3b82f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  userRole: {
    fontSize: '14px',
    color: '#6b7280',
  },
  statsContainer: {
    display: 'flex',
    padding: '0 20px',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    flex: '1',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  tabsContainer: {
    display: 'flex',
    padding: '0 20px',
    marginBottom: '16px',
  },
  tab: {
    flex: '1',
    padding: '12px 0',
    textAlign: 'center',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: '0 20px 40px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    flex: '1',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
  },
  statusText: {
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  locationText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  cardContent: {
    padding: '16px',
  },
  producerInfo: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  producerDetails: {
    marginLeft: '12px',
    flex: '1',
  },
  producerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '2px',
  },
  producerContact: {
    fontSize: '14px',
    color: '#6b7280',
  },
  descriptionSection: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
  },
  descriptionText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.4',
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  actionButton: {
    flex: '1',
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#10b981',
    color: 'white',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
  },
  contactButton: {
    backgroundColor: 'transparent',
    border: '1px solid #6b7280',
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    paddingTop: '40px',
    paddingBottom: '40px',
  },
  emptyStateTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  emptyStateSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    padding: '0 20px',
  },
};