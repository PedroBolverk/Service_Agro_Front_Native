import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';

interface ServiceDescriptionScreenProps {
  serviceType: string;
  onBack: () => void;
  onSubmit: (description: string) => void;
}

export default function ServiceDescriptionScreen({ serviceType, onBack, onSubmit }: ServiceDescriptionScreenProps) {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o problema ou serviço necessário.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(description);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{serviceType}</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Descreva o serviço"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.button}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack} style={styles.button}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold' },
  textInput: { borderWidth: 1, padding: 10, marginVertical: 10 },
  button: { padding: 15, backgroundColor: '#28a745', marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
