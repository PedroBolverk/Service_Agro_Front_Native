import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';  // Para acessar o token e o usuário
import MechanicDashboard from '../../components/MechanicDashboardComplete';  // Dashboard do mecânico
import ProducerDashboard from '../../components/ProducerDashboard';

export default function Index() {
  const { user, token } = useAuth();  // Pega o usuário logado e o token

  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Faça login...</Text>
      </View>
    );
  }

  // Se o usuário for PRODUTOR, renderiza o dashboard de PRODUTOR
  if (user?.role === 'PRODUCER') {
    return <ProducerDashboard token={token} />;
  }

  // Se o usuário for MECÂNICO, renderiza o dashboard de MECÂNICO
  if (user?.role === 'MECHANIC') {
    return <MechanicDashboard token={token} />;
  }

  // Se não for nenhum dos dois, retorna um erro ou uma página informando que o acesso não é permitido
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Acesso não permitido.</Text>
    </View>
  );
}
