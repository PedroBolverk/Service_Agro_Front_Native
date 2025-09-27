// app/(tabs)/map.tsx
import React, { useMemo } from 'react';
import { Platform, View, Text } from 'react-native';
import { useAuth } from '../../src/store/auth';

export default function MapTab() {
  const { token } = useAuth();

  const Comp = require('../../src/screens/MapUnified').default;

  if (!token) {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Faça login…</Text>
      </View>
    );
  }
  return <Comp token={token} />;
}
