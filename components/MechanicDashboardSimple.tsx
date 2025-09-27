import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  User,
  Wrench,
  AlertCircle,
  MessageCircle,
  Phone,
  Mail,
  Settings
} from "lucide-react";

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

export function MechanicDashboardSimple() {
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  // Mock data
  const mockAssignments: ServiceAssignment[] = [
    {
      id: "1",
      status: "PENDENTE",
      createdAt: "2024-01-15T10:30:00Z",
      solicitacaoServico: {
        id: "req-1",
        description: "Trator apresentando problema no motor, fazendo ruídos estranhos durante operação. Necessário diagnóstico completo.",
        machineType: "Trator",
        status: "ATRIBUIDA",
        createdAt: "2024-01-15T10:00:00Z",
        scheduledFor: "2024-01-16T08:00:00Z",
        producer: {
          fullName: "João Silva",
          phone: "(11) 98765-4321",
          email: "joao.silva@fazenda.com"
        }
      }
    },
    {
      id: "2",
      status: "ACEITA",
      createdAt: "2024-01-14T14:20:00Z",
      decidedAt: "2024-01-14T15:00:00Z",
      solicitacaoServico: {
        id: "req-2",
        description: "Colheitadeira com problema na esteira transportadora. Grãos ficando presos.",
        machineType: "Colheitadeira",
        status: "ATRIBUIDA",
        createdAt: "2024-01-14T14:00:00Z",
        producer: {
          fullName: "Maria Santos",
          phone: "(11) 97654-3210",
          email: "maria.santos@campo.com"
        }
      }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setAssignments(mockAssignments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAcceptAssignment = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'ACEITA' as const, decidedAt: new Date().toISOString() }
          : assignment
      )
    );
  };

  const handleRejectAssignment = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'RECUSADA' as const, decidedAt: new Date().toISOString() }
          : assignment
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'ACEITA':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'RECUSADA':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'Aguardando';
      case 'ACEITA':
        return 'Aceita';
      case 'RECUSADA':
        return 'Recusada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-orange-100 text-orange-800';
      case 'ACEITA':
        return 'bg-green-100 text-green-800';
      case 'RECUSADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === "pending") return assignment.status === "PENDENTE";
    if (activeTab === "accepted") return assignment.status === "ACEITA";
    if (activeTab === "rejected") return assignment.status === "RECUSADA";
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              Dashboard Mecânico
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas solicitações de serviço
            </p>
          </div>
          <button className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-medium">
                  {assignments.filter(a => a.status === 'PENDENTE').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aceitas</p>
                <p className="text-2xl font-medium">
                  {assignments.filter(a => a.status === 'ACEITA').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendadas</p>
                <p className="text-2xl font-medium">
                  {assignments.filter(a => a.solicitacaoServico.scheduledFor).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {[
              { id: "pending", label: "Pendentes", icon: Clock },
              { id: "accepted", label: "Aceitas", icon: CheckCircle },
              { id: "rejected", label: "Recusadas", icon: XCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-muted-foreground">
                Não há solicitações {activeTab === "pending" ? "pendentes" : activeTab === "accepted" ? "aceitas" : "recusadas"} no momento.
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      {getStatusText(assignment.status)}
                    </div>
                    {assignment.solicitacaoServico.machineType && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {assignment.solicitacaoServico.machineType}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(assignment.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Service Description */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Descrição do Serviço
                    </h4>
                    <p className="text-muted-foreground">
                      {assignment.solicitacaoServico.description}
                    </p>
                  </div>

                  {/* Producer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Produtor
                      </h5>
                      <p className="text-sm">{assignment.solicitacaoServico.producer.fullName}</p>
                      {assignment.solicitacaoServico.producer.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {assignment.solicitacaoServico.producer.phone}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {assignment.solicitacaoServico.producer.email}
                      </p>
                    </div>

                    {assignment.solicitacaoServico.scheduledFor && (
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Agendamento
                        </h5>
                        <p className="text-sm">
                          {new Date(assignment.solicitacaoServico.scheduledFor).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(assignment.solicitacaoServico.scheduledFor).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {assignment.status === 'PENDENTE' && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleAcceptAssignment(assignment.id)}
                        className="flex-1 h-10 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aceitar
                      </button>
                      <button
                        onClick={() => handleRejectAssignment(assignment.id)}
                        className="flex-1 h-10 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Recusar
                      </button>
                    </div>
                  )}

                  {assignment.status === 'ACEITA' && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button className="flex-1 h-10 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Ver Localização
                      </button>
                      <button className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contatar Produtor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}