// app/(tabs)/map.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';
import { useLocalSearchParams } from 'expo-router';

export default function MapTab() {
  const { token } = useAuth();

  const params = useLocalSearchParams<{ solicitacaoServicoId?: string | string[] }>();
  const solicitacaoServicoId =
    Array.isArray(params.solicitacaoServicoId)
      ? params.solicitacaoServicoId[0]
      : params.solicitacaoServicoId || '';

  // mantém seu require dinâmico
  const Comp = require('../../src/screens/MapUnified').default;

  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Faça login…</Text>
      </View>
    );
  }

  console.log('[MAP TAB] solicitacaoServicoId param =', solicitacaoServicoId);

  // repassa como prop
  return <Comp token={token} solicitacaoServicoId={solicitacaoServicoId} />;
}
