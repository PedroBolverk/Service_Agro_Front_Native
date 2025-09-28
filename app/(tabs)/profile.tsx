import React, { useMemo } from 'react';
import { Platform, View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';

export default function Profile() {
  const { token, user } = useAuth();  // Pegando token e usuário com a role

  const MechanicComp = require('../../components/ProfileScreen').default;  // Componente para mecânico
  const ProducerComp = require('../../components/ProfileScreen').default;  // Componente para produtor

  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Faça login ou Cadastre-se</Text>
      </View>
    );
  }

  if (user?.role === 'MECHANIC') {
    return <MechanicComp token={token} />;  // Se for mecânico, renderiza o componente de mecânico
  }

  if (user?.role === 'PRODUCER') {
    return <ProducerComp token={token} />;  // Se for produtor, renderiza o componente de produtor
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Role desconhecida</Text>  {/* Caso a role não seja 'MECHANIC' nem 'PRODUCER' */}
    </View>
  );
}
