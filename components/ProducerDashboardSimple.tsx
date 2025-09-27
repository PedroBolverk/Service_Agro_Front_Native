import { useState, useEffect } from "react";
import { 
  Plus, 
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
  Settings,
  Tractor,
  Wheat,
  Truck,
  Droplets,
  Sprout
} from "lucide-react";

interface ServiceRequest {
  id: string;
  description: string;
  machineType?: string;
  status: 'ABERTA' | 'ATRIBUIDA' | 'CANCELADA' | 'CONCLUIDA';
  createdAt: string;
  scheduledFor?: string;
  mechanic?: {
    fullName: string;
    phone?: string;
    email: string;
  };
}

export function ProducerDashboardSimple() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("open");

  // Mock data
  const mockRequests: ServiceRequest[] = [
    {
      id: "req-1",
      description: "Trator apresentando problema no motor, fazendo ruídos estranhos durante operação. Necessário diagnóstico completo.",
      machineType: "Trator",
      status: "ATRIBUIDA",
      createdAt: "2024-01-15T10:00:00Z",
      scheduledFor: "2024-01-16T08:00:00Z",
      mechanic: {
        fullName: "Carlos Manutenção",
        phone: "(11) 91234-5678",
        email: "carlos@manutenção.com"
      }
    },
    {
      id: "req-2",
      description: "Colheitadeira com problema na esteira transportadora. Grãos ficando presos.",
      machineType: "Colheitadeira",
      status: "ABERTA",
      createdAt: "2024-01-14T14:00:00Z"
    },
    {
      id: "req-3",
      description: "Pulverizador com bicos entupidos, aplicação irregular de defensivos.",
      machineType: "Pulverizador",
      status: "CONCLUIDA",
      createdAt: "2024-01-10T09:00:00Z",
      mechanic: {
        fullName: "Roberto Silva",
        phone: "(11) 98765-4321",
        email: "roberto@agricola.com"
      }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getMachineIcon = (machineType?: string) => {
    switch (machineType) {
      case 'Trator':
        return <Tractor className="h-4 w-4 text-green-600" />;
      case 'Colheitadeira':
        return <Wheat className="h-4 w-4 text-yellow-600" />;
      case 'Caminhão':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Pulverizador':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'Plantadeira':
        return <Sprout className="h-4 w-4 text-green-500" />;
      default:
        return <Wrench className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'ATRIBUIDA':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'CONCLUIDA':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELADA':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return 'Aguardando';
      case 'ATRIBUIDA':
        return 'Atribuída';
      case 'CONCLUIDA':
        return 'Concluída';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return 'bg-orange-100 text-orange-800';
      case 'ATRIBUIDA':
        return 'bg-blue-100 text-blue-800';
      case 'CONCLUIDA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === "open") return request.status === "ABERTA" || request.status === "ATRIBUIDA";
    if (activeTab === "completed") return request.status === "CONCLUIDA";
    if (activeTab === "cancelled") return request.status === "CANCELADA";
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
              <Tractor className="h-6 w-6" />
              Dashboard Produtor
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas solicitações de serviço
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Solicitação
            </button>
            <button className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Abertas</p>
                <p className="text-2xl font-medium">
                  {requests.filter(r => r.status === 'ABERTA').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atribuídas</p>
                <p className="text-2xl font-medium">
                  {requests.filter(r => r.status === 'ATRIBUIDA').length}
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
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-medium">
                  {requests.filter(r => r.status === 'CONCLUIDA').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendadas</p>
                <p className="text-2xl font-medium">
                  {requests.filter(r => r.scheduledFor).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {[
              { id: "open", label: "Em Andamento", icon: Clock },
              { id: "completed", label: "Concluídas", icon: CheckCircle },
              { id: "cancelled", label: "Canceladas", icon: XCircle }
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

        {/* Service Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-muted-foreground">
                Não há solicitações {activeTab === "open" ? "em andamento" : activeTab === "completed" ? "concluídas" : "canceladas"} no momento.
              </p>
              {activeTab === "open" && (
                <button className="mt-4 h-10 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  Criar Primeira Solicitação
                </button>
              )}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-6 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {getStatusText(request.status)}
                    </div>
                    {request.machineType && (
                      <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium flex items-center gap-1">
                        {getMachineIcon(request.machineType)}
                        {request.machineType}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString('pt-BR')}
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
                      {request.description}
                    </p>
                  </div>

                  {/* Mechanic Info and Schedule */}
                  {(request.mechanic || request.scheduledFor) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {request.mechanic && (
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Mecânico Responsável
                          </h5>
                          <p className="text-sm">{request.mechanic.fullName}</p>
                          {request.mechanic.phone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {request.mechanic.phone}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {request.mechanic.email}
                          </p>
                        </div>
                      )}

                      {request.scheduledFor && (
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Agendamento
                          </h5>
                          <p className="text-sm">
                            {new Date(request.scheduledFor).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(request.scheduledFor).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    {request.status === 'ABERTA' && (
                      <>
                        <button className="flex-1 h-10 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Ver no Mapa
                        </button>
                        <button className="px-4 h-10 border border-border bg-background text-foreground rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Cancelar
                        </button>
                      </>
                    )}

                    {request.status === 'ATRIBUIDA' && (
                      <>
                        <button className="flex-1 h-10 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Acompanhar
                        </button>
                        {request.mechanic && (
                          <button className="flex-1 h-10 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contatar Mecânico
                          </button>
                        )}
                      </>
                    )}

                    {request.status === 'CONCLUIDA' && (
                      <button className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Avaliar Serviço
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}