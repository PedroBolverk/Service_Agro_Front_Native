// app/(tabs)/serviceSelection.tsx
import React from 'react';
import { Platform, View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';

export default function ServiceSelection() {
  const { token } = useAuth();

  const ServiceSelectionScreen = require('../../components/ServiceRequestScreenWeb').default;

  if (!token) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Faça login…</Text>
      </View>
    );
  }

  return <ServiceSelectionScreen token={token} />;
}
