import { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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
  Tractor,
  Truck,
  Settings
} from "lucide-react";
import { toast } from "sonner";

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

export function ProducerDashboard() {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<NewServiceRequest>({
    machineType: "",
    description: "",
  });

  const machineTypes = [
    { value: "trator", label: "Trator", icon: Tractor },
    { value: "colheitadeira", label: "Colheitadeira", icon: Settings },
    { value: "caminhao", label: "Caminhão", icon: Truck },
    { value: "implemento", label: "Implemento Agrícola", icon: Wrench },
    { value: "outros", label: "Outros", icon: Settings },
  ];

  useEffect(() => {
    if (user?.role === 'PRODUCER') {
      fetchServiceRequests();
    }
  }, [user]);

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/solicitacoes-servicos?producerId=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServiceRequests(data);
      }
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.machineType || !newRequest.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/solicitacoes-servicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newRequest,
          producerId: user?.id,
        }),
      });

      if (response.ok) {
        toast.success('Solicitação criada com sucesso!');
        setIsCreateDialogOpen(false);
        setNewRequest({
          machineType: "",
          description: "",
        });
        fetchServiceRequests();
      } else {
        toast.error('Erro ao criar solicitação');
      }
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      toast.error('Erro ao criar solicitação');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/solicitacoes-servicos/${requestId}/cancelar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Solicitação cancelada');
        fetchServiceRequests();
      } else {
        toast.error('Erro ao cancelar solicitação');
      }
    } catch (error) {
      console.error('Erro ao cancelar solicitação:', error);
      toast.error('Erro ao cancelar solicitação');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ABERTA: { variant: "outline" as const, icon: Clock, text: "Aberta" },
      ATRIBUIDA: { variant: "default" as const, icon: Wrench, text: "Atribuída" },
      CANCELADA: { variant: "destructive" as const, icon: XCircle, text: "Cancelada" },
      CONCLUIDA: { variant: "secondary" as const, icon: CheckCircle, text: "Concluída" },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeRequests = serviceRequests.filter(r => r.status === 'ABERTA' || r.status === 'ATRIBUIDA');
  const completedRequests = serviceRequests.filter(r => r.status === 'CONCLUIDA' || r.status === 'CANCELADA');

  if (user?.role !== 'PRODUCER') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">
              Esta página é apenas para produtores.
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
            <h1 className="text-primary mb-2">Painel do Produtor</h1>
            <p className="text-muted-foreground">
              Gerencie suas solicitações de manutenção
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Solicitação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova Solicitação de Serviço</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="machineType">Tipo de Equipamento *</Label>
                    <Select 
                      value={newRequest.machineType} 
                      onValueChange={(value) => setNewRequest(prev => ({ ...prev, machineType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {machineTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição do Problema *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente o problema do equipamento..."
                      value={newRequest.description}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreateRequest}
                      className="flex-1"
                    >
                      Criar Solicitação
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Avatar>
              <AvatarImage src={user?.producer?.photoUrl} />
              <AvatarFallback>
                {user?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">Produtor</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Em Andamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRequests.length}</div>
              <p className="text-muted-foreground">Solicitações ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Atribuídas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceRequests.filter(r => r.status === 'ATRIBUIDA').length}
              </div>
              <p className="text-muted-foreground">Com mecânico designado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Concluídas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceRequests.filter(r => r.status === 'CONCLUIDA').length}
              </div>
              <p className="text-muted-foreground">Serviços finalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Requests Lists */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Em Andamento ({activeRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Histórico ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhuma solicitação ativa</h3>
                  <p className="text-muted-foreground mb-4">
                    Você não possui solicitações em andamento.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Solicitação
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeRequests.map((request) => (
                <ServiceRequestCard 
                  key={request.id} 
                  request={request}
                  onCancel={() => handleCancelRequest(request.id)}
                  showActions={true}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhum serviço no histórico</h3>
                  <p className="text-muted-foreground">
                    Seus serviços concluídos aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedRequests.map((request) => (
                <ServiceRequestCard 
                  key={request.id} 
                  request={request}
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

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onCancel?: () => void;
  showActions?: boolean;
}

function ServiceRequestCard({ request, onCancel, showActions = false }: ServiceRequestCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ABERTA: { variant: "outline" as const, icon: Clock, text: "Aberta" },
      ATRIBUIDA: { variant: "default" as const, icon: Wrench, text: "Atribuída" },
      CANCELADA: { variant: "destructive" as const, icon: XCircle, text: "Cancelada" },
      CONCLUIDA: { variant: "secondary" as const, icon: CheckCircle, text: "Concluída" },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMachineTypeIcon = (machineType: string) => {
    const iconMap = {
      trator: Tractor,
      colheitadeira: Settings,
      caminhao: Truck,
      implemento: Wrench,
      outros: Settings,
    };
    
    return iconMap[machineType as keyof typeof iconMap] || Settings;
  };

  const assignedMechanic = request.atribuicoes.find(a => a.status === 'ACEITA')?.mechanic;
  const MachineIcon = getMachineTypeIcon(request.machineType);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MachineIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">
                  {request.machineType.charAt(0).toUpperCase() + request.machineType.slice(1)}
                </CardTitle>
              </div>
              {getStatusBadge(request.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(request.createdAt)}
              </div>
              {request.locationLat && request.locationLng && (
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
        {/* Assigned Mechanic */}
        {assignedMechanic && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={assignedMechanic.photoUrl} />
              <AvatarFallback>
                {assignedMechanic.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{assignedMechanic.fullName}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {assignedMechanic.specialty && (
                  <span>{assignedMechanic.specialty}</span>
                )}
                {assignedMechanic.phone && (
                  <span>{assignedMechanic.phone}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Service Description */}
        <div>
          <h4 className="mb-2">Descrição do Problema</h4>
          <p className="text-muted-foreground leading-relaxed">
            {request.description}
          </p>
        </div>

        {/* Assignments Status */}
        {request.atribuicoes.length > 0 && (
          <div>
            <h4 className="mb-2">Status das Atribuições</h4>
            <div className="space-y-2">
              {request.atribuicoes.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">{assignment.mechanic.fullName}</span>
                  <Badge 
                    variant={
                      assignment.status === 'ACEITA' ? 'default' : 
                      assignment.status === 'PENDENTE' ? 'outline' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {assignment.status === 'ACEITA' ? 'Aceita' :
                     assignment.status === 'PENDENTE' ? 'Pendente' :
                     assignment.status === 'RECUSADA' ? 'Recusada' : 'Cancelada'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && request.status === 'ABERTA' && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button 
                variant="destructive"
                onClick={onCancel}
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Solicitação
              </Button>
            </div>
          </>
        )}

        {/* Contact Actions for Assigned Services */}
        {assignedMechanic && request.status === 'ATRIBUIDA' && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar com Mecânico
              </Button>
              {request.locationLat && request.locationLng && (
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Compartilhar Localização
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}