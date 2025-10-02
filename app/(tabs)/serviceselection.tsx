import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';

export default function ServiceSelection() {
  const { user, token } = useAuth();
  const isProducer = user?.role === 'PRODUCER';

  if (!token) {
    // Sem redirecionar — apenas informa
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Faça login…</Text>
      </View>
    );
  }

  if (!isProducer) {
    // Proteção da rota sem redirecionar
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Acesso não permitido.</Text>
      </View>
    );
  }

  // Só PRODUCER vê o conteúdo
  const ServiceSelectionScreen =
    require('../../components/ServiceRequestScreenWeb').default;

  return <ServiceSelectionScreen token={token} />;
}
