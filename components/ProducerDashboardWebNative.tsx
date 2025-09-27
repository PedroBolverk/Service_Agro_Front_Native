import React, { useState, useEffect } from "react";

interface ServiceRequest {
  id: string;
  description: string;
  machineType: string;
  locationLat?: number;
  locationLng?: number;
  scheduledFor?: string;
  status: 'ABERTA' | 'ATRIBUIDA' | 'CANCELADA' | 'CONCLUIDA';
  createdAt: string;
  updatedAt: string;
  atribuicoes: Array<{
    id: string;
    status: 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA';
    createdAt: string;
    decidedAt?: string;
    mechanic: {
      id: string;
      fullName: string;
      phone?: string;
      email: string;
      specialty?: string;
      photoUrl?: string;
    };
  }>;
}

interface NewServiceRequest {
  machineType: string;
  description: string;
  locationLat?: number;
  locationLng?: number;
  scheduledFor?: string;
}

export function ProducerDashboardWebNative() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMachineTypePicker, setShowMachineTypePicker] = useState(false);
  const [newRequest, setNewRequest] = useState<NewServiceRequest>({
    machineType: "",
    description: "",
  });

  // Mock user data - replace with actual auth
  const user = {
    id: "mock-producer-id",
    fullName: "Maria Santos",
    role: "PRODUCER",
    producer: {}
  };

  const machineTypes = [
    { value: "trator", label: "🚜 Trator" },
    { value: "colheitadeira", label: "🌾 Colheitadeira" },
    { value: "caminhao", label: "🚛 Caminhão" },
    { value: "implemento", label: "🔧 Implemento Agrícola" },
    { value: "outros", label: "⚙️ Outros" },
  ];

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockRequests: ServiceRequest[] = [
        {
          id: "1",
          description: "Problema no motor do trator, fazendo ruído estranho e perdendo potência durante o trabalho.",
          machineType: "trator",
          status: "ABERTA",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          atribuicoes: [
            {
              id: "attr-1",
              status: "PENDENTE",
              createdAt: new Date().toISOString(),
              mechanic: {
                id: "mech-1",
                fullName: "João Silva",
                phone: "(11) 99999-8888",
                email: "joao@mecanica.com",
                specialty: "Tratores"
              }
            }
          ]
        },
        {
          id: "2",
          description: "Colheitadeira com problema na esteira de grãos, não está funcionando corretamente.",
          machineType: "colheitadeira",
          status: "ATRIBUIDA",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          atribuicoes: [
            {
              id: "attr-2",
              status: "ACEITA",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              decidedAt: new Date(Date.now() - 3600000).toISOString(),
              mechanic: {
                id: "mech-2",
                fullName: "Pedro Oliveira",
                phone: "(11) 88888-7777",
                email: "pedro@agro.com",
                specialty: "Colheitadeiras"
              }
            }
          ]
        }
      ];
      
      setServiceRequests(mockRequests);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      alert('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.machineType || !newRequest.description) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Mock API call
      alert('Solicitação criada com sucesso!');
      setIsCreateModalOpen(false);
      setNewRequest({
        machineType: "",
        description: "",
      });
      fetchServiceRequests();
    } catch (error) {
      alert('Erro ao criar solicitação');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      try {
        alert('Solicitação cancelada');
        fetchServiceRequests();
      } catch (error) {
        alert('Erro ao cancelar solicitação');
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
      case 'ABERTA': return '#f59e0b';
      case 'ATRIBUIDA': return '#3b82f6';
      case 'CANCELADA': return '#ef4444';
      case 'CONCLUIDA': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ABERTA': return 'Aberta';
      case 'ATRIBUIDA': return 'Atribuída';
      case 'CANCELADA': return 'Cancelada';
      case 'CONCLUIDA': return 'Concluída';
      default: return status;
    }
  };

  const getMachineIcon = (machineType: string) => {
    switch (machineType) {
      case 'trator': return '🚜';
      case 'colheitadeira': return '🌾';
      case 'caminhao': return '🚛';
      case 'implemento': return '🔧';
      default: return '⚙️';
    }
  };

  const activeRequests = serviceRequests.filter(r => r.status === 'ABERTA' || r.status === 'ATRIBUIDA');
  const completedRequests = serviceRequests.filter(r => r.status === 'CONCLUIDA' || r.status === 'CANCELADA');

  const renderServiceCard = (request: ServiceRequest, showActions: boolean = false) => {
    const assignedMechanic = request.atribuicoes.find(a => a.status === 'ACEITA')?.mechanic;

    return (
      <div key={request.id} style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitleRow}>
            <div style={styles.machineTypeRow}>
              <span style={styles.machineIcon}>{getMachineIcon(request.machineType)}</span>
              <div style={styles.cardTitle}>
                {request.machineType.charAt(0).toUpperCase() + request.machineType.slice(1)}
              </div>
            </div>
            <div style={{...styles.statusBadge, backgroundColor: getStatusColor(request.status)}}>
              <span style={styles.statusText}>{getStatusText(request.status)}</span>
            </div>
          </div>
          <div style={styles.dateText}>
            📅 {formatDate(request.createdAt)}
          </div>
          {request.locationLat && (
            <div style={styles.locationText}>📍 Localização disponível</div>
          )}
        </div>

        <div style={styles.cardContent}>
          {/* Assigned Mechanic */}
          {assignedMechanic && (
            <div style={styles.mechanicInfo}>
              <div style={styles.avatar}>
                <span style={styles.avatarText}>
                  {assignedMechanic.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div style={styles.mechanicDetails}>
                <div style={styles.mechanicName}>{assignedMechanic.fullName}</div>
                <div style={styles.mechanicContact}>
                  {assignedMechanic.specialty && `${assignedMechanic.specialty} • `}
                  {assignedMechanic.phone}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div style={styles.descriptionSection}>
            <div style={styles.sectionTitle}>Descrição do Problema</div>
            <div style={styles.descriptionText}>
              {request.description}
            </div>
          </div>

          {/* Assignment Status */}
          {request.atribuicoes.length > 0 && (
            <div style={styles.assignmentsSection}>
              <div style={styles.sectionTitle}>Status das Atribuições</div>
              {request.atribuicoes.map((assignment) => (
                <div key={assignment.id} style={styles.assignmentItem}>
                  <span style={styles.assignmentMechanic}>{assignment.mechanic.fullName}</span>
                  <div style={{...styles.assignmentBadge, backgroundColor: getStatusColor(assignment.status)}}>
                    <span style={styles.assignmentStatusText}>
                      {assignment.status === 'ACEITA' ? 'Aceita' :
                       assignment.status === 'PENDENTE' ? 'Pendente' :
                       assignment.status === 'RECUSADA' ? 'Recusada' : 'Cancelada'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {showActions && request.status === 'ABERTA' && (
            <div style={styles.actionsRow}>
              <button 
                style={{...styles.actionButton, ...styles.cancelButton}}
                onClick={() => handleCancelRequest(request.id)}
              >
                ✗ Cancelar Solicitação
              </button>
            </div>
          )}

          {/* Contact Actions */}
          {assignedMechanic && request.status === 'ATRIBUIDA' && (
            <div style={styles.actionsRow}>
              <button style={{...styles.actionButton, ...styles.contactButton}}>
                💬 Conversar
              </button>
              {request.locationLat && (
                <button style={{...styles.actionButton, ...styles.contactButton}}>
                  📍 Localização
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    let data: ServiceRequest[] = [];
    let emptyMessage = '';

    switch (activeTab) {
      case 'active':
        data = activeRequests;
        emptyMessage = 'Nenhuma solicitação ativa';
        break;
      case 'completed':
        data = completedRequests;
        emptyMessage = 'Nenhum serviço no histórico';
        break;
    }

    if (data.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateTitle}>{emptyMessage}</div>
          <div style={styles.emptyStateSubtitle}>
            {activeTab === 'active' 
              ? 'Você não possui solicitações em andamento.'
              : 'Seus serviços concluídos aparecerão aqui.'
            }
          </div>
          {activeTab === 'active' && (
            <button 
              style={styles.createButton}
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Criar Nova Solicitação
            </button>
          )}
        </div>
      );
    }

    return (
      <div>
        {data.map(request => renderServiceCard(request, activeTab === 'active'))}
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
          <div style={styles.title}>Painel do Produtor</div>
          <div style={styles.subtitle}>Gerencie suas solicitações de manutenção</div>
        </div>
        <div style={styles.headerActions}>
          <button 
            style={styles.newRequestButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Nova
          </button>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <div style={styles.userName}>{user.fullName}</div>
              <div style={styles.userRole}>Produtor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{activeRequests.length}</div>
          <div style={styles.statLabel}>Em Andamento</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {serviceRequests.filter(r => r.status === 'ATRIBUIDA').length}
          </div>
          <div style={styles.statLabel}>Atribuídas</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {serviceRequests.filter(r => r.status === 'CONCLUIDA').length}
          </div>
          <div style={styles.statLabel}>Concluídas</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'active' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('active')}
        >
          <span style={{...styles.tabText, ...(activeTab === 'active' ? styles.activeTabText : {})}}>
            Em Andamento ({activeRequests.length})
          </span>
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'completed' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('completed')}
        >
          <span style={{...styles.tabText, ...(activeTab === 'completed' ? styles.activeTabText : {})}}>
            Histórico ({completedRequests.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {renderTabContent()}
      </div>

      {/* Create Request Modal */}
      {isCreateModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Nova Solicitação de Serviço</div>
              <button 
                style={styles.modalCloseButton}
                onClick={() => setIsCreateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formField}>
                <div style={styles.fieldLabel}>Tipo de Equipamento *</div>
                <button 
                  style={styles.selectButton}
                  onClick={() => setShowMachineTypePicker(true)}
                >
                  <span style={newRequest.machineType ? styles.selectButtonTextSelected : styles.selectButtonText}>
                    {newRequest.machineType 
                      ? machineTypes.find(t => t.value === newRequest.machineType)?.label 
                      : 'Selecione o equipamento'
                    }
                  </span>
                  <span style={styles.selectArrow}>▼</span>
                </button>
              </div>

              <div style={styles.formField}>
                <div style={styles.fieldLabel}>Descrição do Problema *</div>
                <textarea
                  style={styles.textArea}
                  placeholder="Descreva detalhadamente o problema do equipamento..."
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div style={styles.modalActions}>
                <button 
                  style={styles.createActionButton}
                  onClick={handleCreateRequest}
                >
                  Criar Solicitação
                </button>
                <button 
                  style={styles.cancelActionButton}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Machine Type Picker Modal */}
      {showMachineTypePicker && (
        <div style={styles.pickerOverlay} onClick={() => setShowMachineTypePicker(false)}>
          <div style={styles.pickerContainer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.pickerHeader}>
              <div style={styles.pickerTitle}>Selecione o Equipamento</div>
              <button 
                style={styles.pickerCloseButton}
                onClick={() => setShowMachineTypePicker(false)}
              >
                ✕
              </button>
            </div>
            {machineTypes.map((type) => (
              <button
                key={type.value}
                style={styles.pickerOption}
                onClick={() => {
                  setNewRequest(prev => ({ ...prev, machineType: type.value }));
                  setShowMachineTypePicker(false);
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}
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
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  newRequestButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
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
  machineTypeRow: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  machineIcon: {
    fontSize: '20px',
    marginRight: '8px',
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
  mechanicInfo: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  mechanicDetails: {
    marginLeft: '12px',
    flex: '1',
  },
  mechanicName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '2px',
  },
  mechanicContact: {
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
  assignmentsSection: {
    marginBottom: '16px',
  },
  assignmentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '4px',
  },
  assignmentMechanic: {
    fontSize: '14px',
    color: '#1f2937',
    flex: '1',
  },
  assignmentBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
  },
  assignmentStatusText: {
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
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
  cancelButton: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
  contactButton: {
    backgroundColor: 'transparent',
    border: '1px solid #6b7280',
    color: '#6b7280',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    marginTop: '16px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
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
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #f3f4f6',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
  },
  modalContent: {
    padding: '20px',
  },
  formField: {
    marginBottom: '20px',
  },
  fieldLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
    display: 'block',
  },
  selectButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  selectButtonText: {
    color: '#9ca3af',
  },
  selectButtonTextSelected: {
    color: '#1f2937',
  },
  selectArrow: {
    fontSize: '12px',
    color: '#6b7280',
  },
  textArea: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    color: '#1f2937',
    minHeight: '100px',
    backgroundColor: 'white',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  createActionButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  cancelActionButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #d1d5db',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
  },
  
  // Picker Modal Styles
  pickerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '20px',
    width: '90%',
    maxWidth: '400px',
  },
  pickerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #f3f4f6',
  },
  pickerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pickerCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
  },
  pickerOption: {
    width: '100%',
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    color: '#1f2937',
    cursor: 'pointer',
  },
};