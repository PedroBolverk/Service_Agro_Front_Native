import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../src/store/auth'; // Certifique-se de que o hook useAuth está retornando o 'user'
import { useRouter } from 'expo-router';
import axios from 'axios'; // Biblioteca para fazer requisições HTTP

interface ServiceRequestData {
  machineType: string;
  description: string;
  urgency: 'baixa' | 'media' | 'alta';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface MachineType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const machineTypes: MachineType[] = [
  { id: 'trator', name: 'Trator', icon: 'tractor', description: 'Tratores agrícolas e implementos' },
  { id: 'colheitadeira', name: 'Colheitadeira', icon: 'wheat', description: 'Máquinas de colheita' },
  { id: 'pulverizador', name: 'Pulverizador', icon: 'droplet', description: 'Equipamentos de pulverização' },
  { id: 'plantadeira', name: 'Plantadeira', icon: 'leaf', description: 'Máquinas de plantio' },
  { id: 'caminhao', name: 'Caminhão', icon: 'truck', description: 'Veículos de transporte' },
  { id: 'implemento', name: 'Implemento', icon: 'wrench', description: 'Outros implementos agrícolas' }
];

const urgencyLevels = [
  { id: 'baixa', name: 'Baixa', color: '#10b981', description: 'Não há pressa' },
  { id: 'media', name: 'Média', color: '#f59e0b', description: 'Resolver em alguns dias' },
  { id: 'alta', name: 'Alta', color: '#ef4444', description: 'Urgente - parou a produção' }
];

export function ServiceRequestScreen() {
  const { user } = useAuth(); // Obter o usuário autenticado do hook useAuth
  const [requestData, setRequestData] = useState<ServiceRequestData>({
    machineType: '',
    description: '',
    urgency: 'media',
  });

  const router = useRouter();
  const [showMachineTypePicker, setShowMachineTypePicker] = useState(false);
  const [showUrgencyPicker, setShowUrgencyPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMachineTypeSelect = (machineType: MachineType) => {
    setRequestData(prev => ({
      ...prev,
      machineType: machineType.id
    }));
    setShowMachineTypePicker(false);
  };

  const handleUrgencySelect = (urgency: typeof urgencyLevels[0]) => {
    setRequestData(prev => ({
      ...prev,
      urgency: urgency.id as 'baixa' | 'media' | 'alta'
    }));
    setShowUrgencyPicker(false);
  };

  const handleSubmit = async () => {
    if (!requestData.machineType) {
      alert('Por favor, selecione o tipo de equipamento');
      return;
    }

    if (!requestData.description.trim()) {
      alert('Por favor, descreva o problema');
      return;
    }

    if (requestData.description.trim().length < 10) {
      alert('A descrição deve ter pelo menos 10 caracteres');
      return;
    }

    if (!user) {
      alert('Usuário não autenticado!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://192.168.1.101:3000/solicitacoes-servicos', {
        producerId: user.id, // Usando o ID do usuário autenticado
        description: requestData.description.trim(),
        machineType: requestData.machineType,
        locationLat: requestData.location?.latitude,
        locationLng: requestData.location?.longitude,
        status: 'ABERTA', // O status inicial da solicitação
      });

      if (response.status === 201) {
        alert('Sucesso! Sua solicitação foi enviada.');
        // Redireciona para a aba do mapa após a solicitação ser criada
        router.push('/(tabs)/map');
      }

    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro: Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedMachineType = () => {
    return machineTypes.find(type => type.id === requestData.machineType);
  };

  const getSelectedUrgency = () => {
    return urgencyLevels.find(level => level.id === requestData.urgency);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nova Solicitação</Text>
        <Text style={styles.subtitle}>Descreva o problema do seu equipamento</Text>
      </View>

      {/* Machine Type Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Tipo de Equipamento *</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowMachineTypePicker(true)} // Exibe o modal
        >
          <View style={styles.selectContent}>
            {getSelectedMachineType() ? (
              <>
                <Icon name={getSelectedMachineType()?.icon || 'wrench'} size={24} color="#6b7280" />
                <View style={styles.selectTextContainer}>
                  <Text style={styles.selectText}>
                    {getSelectedMachineType()?.name}
                  </Text>
                  <Text style={styles.selectSubtext}>
                    {getSelectedMachineType()?.description}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.selectPlaceholder}>Selecione o tipo de equipamento</Text>
            )}
          </View>
          <Icon name="chevron-down" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Urgency Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Urgência</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowUrgencyPicker(true)} // Exibe o modal
        >
          <View style={styles.selectContent}>
            <View style={[styles.urgencyIndicator, { backgroundColor: getSelectedUrgency()?.color }]} />
            <View style={styles.selectTextContainer}>
              <Text style={styles.selectText}>{getSelectedUrgency()?.name}</Text>
              <Text style={styles.selectSubtext}>{getSelectedUrgency()?.description}</Text>
            </View>
          </View>
          <Icon name="chevron-down" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Descrição do Problema *</Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Descreva detalhadamente o problema do equipamento..."
          value={requestData.description}
          onChangeText={(text) => setRequestData(prev => ({
            ...prev, 
            description: text
          }))} 
        />
        <Text style={styles.charCounter}>
          {requestData.description.length} / 500 caracteres
        </Text>
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, !requestData.machineType || !requestData.description.trim() || isSubmitting ? styles.submitButtonDisabled : {}]}
          onPress={handleSubmit}
          disabled={!requestData.machineType || !requestData.description.trim() || isSubmitting}
        >
          <Text style={[styles.submitButtonText, !requestData.machineType || !requestData.description.trim() || isSubmitting ? styles.submitButtonTextDisabled : {}]}>
            {isSubmitting ? 'Enviando...' : 'Solicitar Atendimento'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Seleção de Tipo de Equipamento */}
      <Modal
        transparent={true}
        visible={showMachineTypePicker}
        animationType="slide"
        onRequestClose={() => setShowMachineTypePicker(false)}
      >
        <View style={styles.modalOverlay} onTouchEnd={() => setShowMachineTypePicker(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecionar Equipamento</Text>
            <ScrollView>
              {machineTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.optionItem}
                  onPress={() => handleMachineTypeSelect(type)}
                >
                  <Icon name={type.icon} size={24} color="#6b7280" />
                  <View style={styles.optionContent}>
                    <Text style={styles.optionName}>{type.name}</Text>
                    <Text style={styles.optionDescription}>{type.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para Seleção de Urgência */}
      <Modal
        transparent={true}
        visible={showUrgencyPicker}
        animationType="slide"
        onRequestClose={() => setShowUrgencyPicker(false)}
      >
        <View style={styles.modalOverlay} onTouchEnd={() => setShowUrgencyPicker(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nível de Urgência</Text>
            <ScrollView>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={styles.optionItem}
                  onPress={() => handleUrgencySelect(level)}
                >
                  <View style={[styles.urgencyIndicator, { backgroundColor: level.color }]} />
                  <View style={styles.optionContent}>
                    <Text style={styles.optionName}>{level.name}</Text>
                    <Text style={styles.optionDescription}>{level.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  selectText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  selectSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  charCounter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9ca3af',
  },
  submitContainer: {
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: '#9ca3af',
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default ServiceRequestScreen;
