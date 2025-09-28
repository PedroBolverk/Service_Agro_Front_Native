import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IoAddCircle, IoCloseCircle } from 'react-icons/io5';
import { toast } from 'sonner'; // Para exibir notificações
import { useAuth } from "../src/store/auth"; // Hook de autenticação

// Definir as props que o componente espera, incluindo o token
interface ProducerDashboardProps {
  token: string;
}

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

export default function ProducerDashboard({token}: ProducerDashboardProps) {
  const { user } = useAuth(); // Hook useAuth para pegar o usuário logado
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<NewServiceRequest>({
    machineType: "",
    description: "",
  });

  useEffect(() => {
    if (user?.role === "PRODUCER") {
      fetchServiceRequests();
    }
  }, [user]);

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch(`/api/solicitacoes-servicos?producerId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServiceRequests(data);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      toast.error("Erro ao carregar solicitações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.machineType || !newRequest.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const response = await fetch("/api/solicitacoes-servicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newRequest,
          producerId: user?.id,
        }),
      });

      if (response.ok) {
        toast.success("Solicitação criada com sucesso!");
        setIsCreateDialogOpen(false);
        setNewRequest({
          machineType: "",
          description: "",
        });
        fetchServiceRequests();
      } else {
        toast.error("Erro ao criar solicitação");
      }
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      toast.error("Erro ao criar solicitação");
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/solicitacoes-servicos/${requestId}/cancelar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Solicitação cancelada");
        fetchServiceRequests();
      } else {
        toast.error("Erro ao cancelar solicitação");
      }
    } catch (error) {
      console.error("Erro ao cancelar solicitação:", error);
      toast.error("Erro ao cancelar solicitação");
    }
  };

  const activeRequests = serviceRequests.filter(
    (r) => r.status === "ABERTA" || r.status === "ATRIBUIDA"
  );
  const completedRequests = serviceRequests.filter(
    (r) => r.status === "CONCLUIDA" || r.status === "CANCELADA"
  );

  if (user?.role !== "PRODUCER") {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.warningText}>Acesso Negado</Text>
          <Text style={styles.subText}>Esta página é apenas para produtores.</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Painel do Produtor</Text>
          <Text style={styles.subTitle}>Gerencie suas solicitações de manutenção</Text>
        </View>
        <TouchableOpacity onPress={() => setIsCreateDialogOpen(true)} style={styles.addButton}>
          <IoAddCircle size={24} color="white" />
          <Text style={styles.addButtonText}>Nova Solicitação</Text>
        </TouchableOpacity>
      </View>

      {/* Solicitações Ativas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statText}>Em Andamento</Text>
          <Text style={styles.statNumber}>{activeRequests.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statText}>Com mecânico designado</Text>
          <Text style={styles.statNumber}>
            {serviceRequests.filter((r) => r.status === "ATRIBUIDA").length}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statText}>Serviços Finalizados</Text>
          <Text style={styles.statNumber}>
            {serviceRequests.filter((r) => r.status === "CONCLUIDA").length}
          </Text>
        </View>
      </View>

      <ScrollView>
        {activeRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            style={styles.requestCard}
            onPress={() => console.log('Detalhes da Solicitação')}>
            <Text>{request.description}</Text>
            <TouchableOpacity onPress={() => handleCancelRequest(request.id)}>
              <IoCloseCircle size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  warningText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  subText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 10,
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    color: '#6b7280',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  requestCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

