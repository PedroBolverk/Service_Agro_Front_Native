import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
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
  Mail
} from "lucide-react";
import { toast } from "sonner";

// Mock data para demonstração
const mockUser = {
  id: "mech-1",
  fullName: "João Silva",
  role: "MECHANIC" as const,
  mechanic: {
    specialty: "Tratores e Implementos",
    photoUrl: "",
    isAvailable: true,
  }
};

const mockAssignments = [
  {
    id: "attr-1",
    status: "PENDENTE" as const,
    createdAt: "2024-01-15T10:30:00Z",
    solicitacaoServico: {
      id: "sol-1",
      description: "Trator John Deere 6600 apresentando problema no motor. Está fazendo ruído estranho durante operação e perdendo potência. Necessário diagnóstico urgente pois é época de colheita.",
      machineType: "Trator",
      locationLat: -23.5505,
      locationLng: -46.6333,
      status: "ATRIBUIDA" as const,
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
    status: "PENDENTE" as const,
    createdAt: "2024-01-15T14:20:00Z",
    solicitacaoServico: {
      id: "sol-2",
      description: "Colheitadeira Case IH com problema na esteira transportadora. Grãos estão caindo durante a colheita. Precisa de reparo rápido.",
      machineType: "Colheitadeira",
      status: "ATRIBUIDA" as const,
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
    status: "ACEITA" as const,
    createdAt: "2024-01-14T08:00:00Z",
    decidedAt: "2024-01-14T09:15:00Z",
    solicitacaoServico: {
      id: "sol-3",
      description: "Plantadeira New Holland com problema no sistema de distribuição de sementes. Algumas fileiras não estão plantando corretamente.",
      machineType: "Plantadeira",
      locationLat: -23.6505,
      locationLng: -46.7333,
      status: "ATRIBUIDA" as const,
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
    status: "RECUSADA" as const,
    createdAt: "2024-01-13T16:00:00Z",
    decidedAt: "2024-01-13T17:30:00Z",
    solicitacaoServico: {
      id: "sol-4",
      description: "Pulverizador com bicos entupidos e problema na bomba de pressão.",
      machineType: "Pulverizador",
      status: "ABERTA" as const,
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
    status: "ACEITA" as const,
    createdAt: "2024-01-12T10:00:00Z",
    decidedAt: "2024-01-12T11:00:00Z",
    solicitacaoServico: {
      id: "sol-5",
      description: "Manutenção preventiva em trator Massey Ferguson 4292. Revisão completa antes da safra.",
      machineType: "Trator",
      status: "CONCLUIDA" as const,
      createdAt: "2024-01-12T09:00:00Z",
      producer: {
        fullName: "Pedro Nascimento",
        phone: "(11) 95432-1098",
        email: "pedro@rural.com"
      }
    }
  }
];

export function MechanicDashboardDemo() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [activeTab, setActiveTab] = useState("pending");

  const handleAcceptService = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: "ACEITA" as const, decidedAt: new Date().toISOString() }
          : assignment
      )
    );
    toast.success('Serviço aceito com sucesso!');
  };

  const handleRejectService = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: "RECUSADA" as const, decidedAt: new Date().toISOString() }
          : assignment
      )
    );
    toast.success('Serviço recusado');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDENTE: { variant: "outline" as const, icon: Clock, text: "Pendente", color: "text-orange-600" },
      ACEITA: { variant: "default" as const, icon: CheckCircle, text: "Aceito", color: "text-green-600" },
      RECUSADA: { variant: "destructive" as const, icon: XCircle, text: "Recusado", color: "text-red-600" },
      CANCELADA: { variant: "secondary" as const, icon: AlertCircle, text: "Cancelado", color: "text-gray-600" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getServiceStatusBadge = (status: string) => {
    const statusConfig = {
      ABERTA: { variant: "outline" as const, text: "Aberto" },
      ATRIBUIDA: { variant: "default" as const, text: "Atribuído" },
      CANCELADA: { variant: "destructive" as const, text: "Cancelado" },
      CONCLUIDA: { variant: "secondary" as const, text: "Concluído" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.text}</Badge>;
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

  const pendingAssignments = assignments.filter(a => a.status === 'PENDENTE');
  const acceptedAssignments = assignments.filter(a => a.status === 'ACEITA' && a.solicitacaoServico.status !== 'CONCLUIDA');
  const completedAssignments = assignments.filter(a => 
    a.status === 'RECUSADA' || a.status === 'CANCELADA' || a.solicitacaoServico.status === 'CONCLUIDA'
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary mb-2">Painel do Mecânico</h1>
            <p className="text-muted-foreground">
              Gerencie suas solicitações de serviço
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {mockUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-medium">{mockUser.fullName}</p>
              <p className="text-sm text-muted-foreground">{mockUser.mechanic.specialty}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Pendentes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments.length}</div>
              <p className="text-muted-foreground">Aguardando resposta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Em Andamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedAssignments.length}</div>
              <p className="text-muted-foreground">Serviços aceitos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Finalizados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAssignments.length}</div>
              <p className="text-muted-foreground">Total histórico</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Lists */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pendentes ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Em Andamento ({acceptedAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Finalizados ({completedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhum serviço pendente</h3>
                  <p className="text-muted-foreground">
                    Você não possui solicitações aguardando resposta.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingAssignments.map((assignment) => (
                <ServiceCard 
                  key={assignment.id} 
                  assignment={assignment}
                  onAccept={() => handleAcceptService(assignment.id)}
                  onReject={() => handleRejectService(assignment.id)}
                  showActions={true}
                  getStatusBadge={getStatusBadge}
                  getServiceStatusBadge={getServiceStatusBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {acceptedAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhum serviço em andamento</h3>
                  <p className="text-muted-foreground">
                    Você não possui serviços aceitos atualmente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              acceptedAssignments.map((assignment) => (
                <ServiceCard 
                  key={assignment.id} 
                  assignment={assignment}
                  showActions={false}
                  getStatusBadge={getStatusBadge}
                  getServiceStatusBadge={getServiceStatusBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhum serviço finalizado</h3>
                  <p className="text-muted-foreground">
                    Seu histórico de serviços aparecerá aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedAssignments.map((assignment) => (
                <ServiceCard 
                  key={assignment.id} 
                  assignment={assignment}
                  showActions={false}
                  getStatusBadge={getStatusBadge}
                  getServiceStatusBadge={getServiceStatusBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  assignment: any;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  getStatusBadge: (status: string) => JSX.Element;
  getServiceStatusBadge: (status: string) => JSX.Element;
  formatDate: (date: string) => string;
}

function ServiceCard({ 
  assignment, 
  onAccept, 
  onReject, 
  showActions = false,
  getStatusBadge,
  getServiceStatusBadge,
  formatDate
}: ServiceCardProps) {
  const { solicitacaoServico } = assignment;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-lg">
                {solicitacaoServico.machineType || 'Equipamento não especificado'}
              </CardTitle>
              {getStatusBadge(assignment.status)}
              {getServiceStatusBadge(solicitacaoServico.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(solicitacaoServico.createdAt)}
              </div>
              {solicitacaoServico.locationLat && solicitacaoServico.locationLng && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Localização disponível
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Producer Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {solicitacaoServico.producer.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{solicitacaoServico.producer.fullName}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {solicitacaoServico.producer.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{solicitacaoServico.producer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{solicitacaoServico.producer.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div>
          <h4 className="mb-2">Descrição do Problema</h4>
          <p className="text-muted-foreground leading-relaxed">
            {solicitacaoServico.description}
          </p>
        </div>

        {/* Actions */}
        {showActions && assignment.status === 'PENDENTE' && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button 
                onClick={onAccept}
                className="flex-1"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aceitar Serviço
              </Button>
              <Button 
                variant="outline"
                onClick={onReject}
                className="flex-1"
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Recusar
              </Button>
            </div>
          </>
        )}

        {/* Contact Actions for Accepted Services */}
        {assignment.status === 'ACEITA' && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar
              </Button>
              {solicitacaoServico.locationLat && solicitacaoServico.locationLng && (
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver Localização
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}