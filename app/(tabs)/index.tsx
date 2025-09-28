import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';

// Importação estática dos componentes
import MechanicDashboard from '../../components/MechanicDashboardComplete';
import ProducerDashboard from '../../components/ProducerDashboard';

export default function Dashboard() {
  const { user, token } = useAuth(); // Acesse tanto o token quanto o usuário

  // Verifica se o token existe e se o usuário está logado
  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Faça login...</Text>
      </View>
    );
  }


  // Se o usuário for produtor, renderiza o dashboard de produtor
  if (user?.role === 'PRODUCER') {
    return <ProducerDashboard token={token} />;
  }
  
  // Se o usuário for mecânico, renderiza o dashboard de mecânico
  if (user?.role === 'MECHANIC') {
    return <MechanicDashboard token={token} />;
  }

  
}
