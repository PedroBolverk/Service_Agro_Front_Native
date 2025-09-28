// src/components/DefaultComponent.tsx

import React from 'react';
import { View, Text } from 'react-native';

interface DefaultComponentProps {
  token: string; // Definir que o token será passado como uma prop
}

const DefaultComponent: React.FC<DefaultComponentProps> = ({ token }) => {
  return (
    <View>
      <Text>Componente Padrão</Text>
      <Text>Token: {token}</Text> {/* Exibindo o token para fins de demonstração */}
    </View>
  );
};

export default DefaultComponent;
