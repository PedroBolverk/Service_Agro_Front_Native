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
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";

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

export function MechanicDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (user?.role === 'MECHANIC') {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/atribuicoes-servicos?mechanicId=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Erro ao buscar atribuições:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptService = async (assignmentId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/atribuicoes-servicos/${assignmentId}/aceitar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Serviço aceito com sucesso!');
        fetchAssignments();
      } else {
        toast.error('Erro ao aceitar serviço');
      }
    } catch (error) {
      console.error('Erro ao aceitar serviço:', error);
      toast.error('Erro ao aceitar serviço');
    }
  };

  const handleRejectService = async (assignmentId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/atribuicoes-servicos/${assignmentId}/recusar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Serviço recusado');
        fetchAssignments();
      } else {
        toast.error('Erro ao recusar serviço');
      }
    } catch (error) {
      console.error('Erro ao recusar serviço:', error);
      toast.error('Erro ao recusar serviço');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDENTE: { variant: "outline" as const, icon: Clock, text: "Pendente" },
      ACEITA: { variant: "default" as const, icon: CheckCircle, text: "Aceito" },
      RECUSADA: { variant: "destructive" as const, icon: XCircle, text: "Recusado" },
      CANCELADA: { variant: "secondary" as const, icon: AlertCircle, text: "Cancelado" },
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
  const acceptedAssignments = assignments.filter(a => a.status === 'ACEITA');
  const completedAssignments = assignments.filter(a => 
    a.status === 'RECUSADA' || a.status === 'CANCELADA' || a.solicitacaoServico.status === 'CONCLUIDA'
  );

  if (user?.role !== 'MECHANIC') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">
              Esta página é apenas para mecânicos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <AvatarImage src={user?.mechanic?.photoUrl} />
              <AvatarFallback>
                {user?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">{user?.mechanic?.specialty}</p>
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
  assignment: ServiceAssignment;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

function ServiceCard({ assignment, onAccept, onReject, showActions = false }: ServiceCardProps) {
  const { solicitacaoServico } = assignment;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDENTE: { variant: "outline" as const, icon: Clock, text: "Pendente" },
      ACEITA: { variant: "default" as const, icon: CheckCircle, text: "Aceito" },
      RECUSADA: { variant: "destructive" as const, icon: XCircle, text: "Recusado" },
      CANCELADA: { variant: "secondary" as const, icon: AlertCircle, text: "Cancelado" },
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">
                {solicitacaoServico.machineType || 'Equipamento não especificado'}
              </CardTitle>
              {getStatusBadge(assignment.status)}
              {getServiceStatusBadge(solicitacaoServico.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {solicitacaoServico.producer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{solicitacaoServico.producer.fullName}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {solicitacaoServico.producer.phone && (
                <span>{solicitacaoServico.producer.phone}</span>
              )}
              <span>{solicitacaoServico.producer.email}</span>
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