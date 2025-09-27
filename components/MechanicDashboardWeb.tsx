import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Wrench,
  AlertCircle,
  MessageCircle,
  Phone,
  Mail,
  User,
  X,
  ExternalLink
} from 'lucide-react';

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

export function MechanicDashboardWeb() {
  // Estados
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(false);
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
      // const response = await fetch(`/api/atribuicoes-servicos?mechanicId=${mockUser.id}`);
      // const data = await response.json();
      // setAssignments(data);
    } catch (error) {
      console.error('Erro ao carregar atribuições:', error);
      alert('Erro ao carregar os serviços');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptService = async (assignmentId: string) => {
    if (!confirm('Você tem certeza que deseja aceitar esta solicitação de serviço?')) {
      return;
    }

    try {
      // const response = await fetch(`/api/atribuicoes-servicos/${assignmentId}/aceitar`, {
      //   method: 'PATCH',
      // });

      // Simulação local
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, status: "ACEITA", decidedAt: new Date().toISOString() }
            : assignment
        )
      );
      
      alert('Serviço aceito com sucesso!');
    } catch (error) {
      console.error('Erro ao aceitar serviço:', error);
      alert('Não foi possível aceitar o serviço');
    }
  };

  const handleRejectService = async (assignmentId: string) => {
    if (!confirm('Você tem certeza que deseja recusar esta solicitação?')) {
      return;
    }

    try {
      // const response = await fetch(`/api/atribuicoes-servicos/${assignmentId}/recusar`, {
      //   method: 'PATCH',
      // });

      // Simulação local
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, status: "RECUSADA", decidedAt: new Date().toISOString() }
            : assignment
        )
      );
      
      alert('Serviço recusado');
    } catch (error) {
      console.error('Erro ao recusar serviço:', error);
      alert('Não foi possível recusar o serviço');
    }
  };

  const handleCallProducer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleOpenLocation = (lat: number, lng: number) => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(url, '_blank');
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
    const colors = {
      PENDENTE: 'text-orange-600 bg-orange-50 border-orange-200',
      ACEITA: 'text-green-600 bg-green-50 border-green-200',
      RECUSADA: 'text-red-600 bg-red-50 border-red-200',
      CANCELADA: 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PENDENTE: Clock,
      ACEITA: CheckCircle,
      RECUSADA: XCircle,
      CANCELADA: AlertCircle,
    };
    return icons[status as keyof typeof icons] || AlertCircle;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel do Mecânico</h1>
              <p className="text-gray-600">Gerencie suas solicitações</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {mockUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{mockUser.fullName}</p>
                <p className="text-sm text-gray-600">{mockUser.mechanic.specialty}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{pendingAssignments.length}</p>
                <p className="text-orange-600">Pendentes</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{acceptedAssignments.length}</p>
                <p className="text-blue-600">Em Andamento</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{completedAssignments.length}</p>
                <p className="text-green-600">Finalizados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pendentes
                {pendingAssignments.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                    {pendingAssignments.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ativos
                {acceptedAssignments.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                    {acceptedAssignments.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Finalizados
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {getCurrentAssignments().length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            getCurrentAssignments().map((assignment) => (
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
              />
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAssignment && (
        <DetailModal
          assignment={selectedAssignment}
          onClose={() => setShowDetailModal(false)}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}
    </div>
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
          icon: Clock,
          title: 'Nenhum serviço pendente',
          subtitle: 'Não há solicitações aguardando sua resposta no momento.',
        };
      case 'active':
        return {
          icon: Wrench,
          title: 'Nenhum serviço ativo',
          subtitle: 'Você não possui serviços em andamento atualmente.',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'Histórico vazio',
          subtitle: 'Seu histórico de serviços aparecerá aqui.',
        };
    }
  };

  const { icon: Icon, title, subtitle } = getEmptyContent();

  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
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
  getStatusIcon: (status: string) => React.ComponentType<any>;
  getStatusColor: (status: string) => string;
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
  getStatusColor
}: ServiceCardProps) {
  const { solicitacaoServico } = assignment;
  const StatusIcon = getStatusIcon(assignment.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {solicitacaoServico.machineType || 'Equipamento'}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(solicitacaoServico.createdAt)}
              </div>
              {solicitacaoServico.locationLat && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Localização
                </div>
              )}
            </div>
          </div>
          
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {assignment.status}
          </div>
        </div>

        {/* Producer */}
        <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {solicitacaoServico.producer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <p className="font-medium text-gray-900">{solicitacaoServico.producer.fullName}</p>
            <p className="text-sm text-gray-600">{solicitacaoServico.producer.email}</p>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {solicitacaoServico.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={onShowDetail}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Ver detalhes
          </button>

          {/* Actions */}
          {showActions && assignment.status === 'PENDENTE' && (
            <div className="flex space-x-3">
              <button
                onClick={onAccept}
                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aceitar
              </button>
              <button
                onClick={onReject}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Recusar
              </button>
            </div>
          )}

          {/* Contact Actions */}
          {assignment.status === 'ACEITA' && (
            <div className="flex space-x-3">
              {solicitacaoServico.producer.phone && (
                <button
                  onClick={() => onCall(solicitacaoServico.producer.phone!)}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Ligar
                </button>
              )}
              {solicitacaoServico.locationLat && (
                <button
                  onClick={() => onOpenLocation(solicitacaoServico.locationLat!, solicitacaoServico.locationLng!)}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-50"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Localização
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DetailModalProps {
  assignment: Assignment;
  onClose: () => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ComponentType<any>;
}

function DetailModal({ 
  assignment, 
  onClose, 
  formatDate, 
  getStatusColor, 
  getStatusIcon 
}: DetailModalProps) {
  const { solicitacaoServico } = assignment;
  const StatusIcon = getStatusIcon(assignment.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Serviço</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(assignment.status)}`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {assignment.status}
          </div>

          {/* Machine Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {solicitacaoServico.machineType || 'Equipamento não especificado'}
            </h3>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Solicitado em:</p>
              <p className="mt-1 text-sm text-gray-900">{formatDate(solicitacaoServico.createdAt)}</p>
            </div>
            {assignment.decidedAt && (
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Decidido em:</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(assignment.decidedAt)}</p>
              </div>
            )}
          </div>

          {/* Producer Details */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-3">Produtor</h4>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {solicitacaoServico.producer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">{solicitacaoServico.producer.fullName}</p>
                <p className="text-sm text-gray-600">{solicitacaoServico.producer.email}</p>
                {solicitacaoServico.producer.phone && (
                  <p className="text-sm text-gray-600">{solicitacaoServico.producer.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-3">Descrição do Problema</h4>
            <p className="text-gray-700 leading-relaxed">{solicitacaoServico.description}</p>
          </div>

          {/* Location */}
          {solicitacaoServico.locationLat && solicitacaoServico.locationLng && (
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-3">Localização</h4>
              <button
                onClick={() => {
                  const url = `https://maps.google.com/?q=${solicitacaoServico.locationLat},${solicitacaoServico.locationLng}`;
                  window.open(url, '_blank');
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir no Maps
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}