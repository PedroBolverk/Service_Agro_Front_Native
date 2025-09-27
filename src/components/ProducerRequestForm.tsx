// src/screens/ProducerRequestForm.tsx (resumo)
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { api } from '../lib/api';
import { getCurrent } from '../lib/location';

export default function ProducerRequestForm() {
  const [description, setDescription] = useState('');
  const [machineType, setMachineType] = useState('Colheitadeira');

  const submit = async () => {
    const pos = await getCurrent();
    const body = {
      description,
      machineType,
      locationLat: pos.lat,
      locationLng: pos.lng,
      // producerId será inferido no back pelo token se quiser (ou enviar explicitamente)
    };
    const res = await api('/solicitacoes-servicos', { method: 'POST', body });
    Alert.alert('Solicitação criada', res.solicit ? 'Aguardando atribuição' : 'Criada');
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Descreva o problema" value={description} onChangeText={setDescription} />
      {/* selecione machineType aqui */}
      <Button title="Solicitar ajuda" onPress={submit} />
    </View>
  );
}
