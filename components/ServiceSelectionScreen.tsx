import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ícones para o React Native

interface ServiceSelectionScreenProps {
  onServiceSelected: (serviceType: string) => void;
  onBack: () => void;
}

const ServiceSelectionScreen: React.FC<ServiceSelectionScreenProps> = ({ onServiceSelected, onBack }) => {
  const [selectedService, setSelectedService] = useState<string>('');

  const services = [
    { id: 'tractor', name: 'Trator', description: 'Manutenção e reparo de tratores agrícolas', icon: 'tractor', color: '#38b000' },
    { id: 'harvester', name: 'Colheitadeira', description: 'Serviços especializados em colheitadeiras', icon: 'agriculture', color: '#facc15' },
    { id: 'truck', name: 'Caminhão', description: 'Manutenção de veículos de transporte agrícola', icon: 'truck', color: '#1d4ed8' },
    { id: 'equipment', name: 'Equipamentos Diversos', description: 'Outros equipamentos e implementos agrícolas', icon: 'wrench', color: '#fb923c' },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      onServiceSelected(service?.name || selectedService);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecionar Serviço</Text>
        <Text style={styles.subtitle}>Escolha o tipo de equipamento para o serviço</Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => handleServiceSelect(service.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
                <Icon name={service.icon} size={30} color="white" /> {/* Ícone de FontAwesome */}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{service.name}</Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Icon name="check" size={12} color="white" /> {/* Ícone de check */}
                    <Text style={styles.selectedText}>Selecionado</Text> {/* O texto "Selecionado" precisa estar dentro de <Text> */}
                  </View>
                )}
                <Text style={styles.cardDescription}>{service.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, !selectedService && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedService}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={onBack}>
          <Text style={[styles.buttonText, styles.outlineButtonText]}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#030213',
  },
  subtitle: {
    fontSize: 16,
    color: '#717182',
  },
  servicesContainer: {
    marginTop: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#030213',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  selectedText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  buttonsContainer: {
    marginTop: 32,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  outlineButtonText: {
    color: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
});

export default ServiceSelectionScreen;
