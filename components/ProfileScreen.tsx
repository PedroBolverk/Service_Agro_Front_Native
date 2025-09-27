import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../src/store/auth'; // Importando o hook de autenticação
import Dialog from 'react-native-dialog';
import { api } from '../src/lib/api'; // Importando a função api para fazer requisições

interface ProfileScreenProps {
  userType: 'mechanic' | 'producer';
}

export default function ProfileScreen({ userType }: ProfileScreenProps) {
  const { signOut, user } = useAuth();  // Usando o hook useAuth para acessar a função de logout e o usuário
  const [visible, setVisible] = useState(false);  // Controle da visibilidade do dialog
  const [profile, setProfile] = useState<any>(null);  // Para armazenar o perfil do usuário
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);  // Controle de carregamento do perfil

  const showDialog = () => setVisible(true); // Exibe o diálogo
  const hideDialog = () => setVisible(false); // Esconde o diálogo

  const handleLogout = () => {
    // Chama a função de logout do Zustand para limpar os dados e deslogar o usuário
    signOut();
    hideDialog(); // Fecha o diálogo após o logout
  };

  useEffect(() => {
    // Função para buscar dados do usuário após o login ou reidratação
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          console.log('Fetching user profile for:', user.id);  // Verifique se user.id está correto
          const response = await api(`/usuarios/${user.id}`, {
            method: 'GET',
            // Aqui você pode adicionar headers, etc.
          });

          // Caso o usuário seja do tipo mecânico, incluindo a especialidade
          if (user.role === 'MECHANIC' && response?.mechanic) {
            setProfile({
              ...response,
              specialty: response.mechanic.specialty, // Inclui a especialidade do mecânico
            });
          } else {
            setProfile(response); // Apenas retorna o perfil se for um produtor
          }

        } catch (error) {
          console.error('Erro ao buscar o perfil do usuário:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  // Se o perfil estiver carregando, mostra um indicador de carregamento
  if (isLoadingProfile || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      {/* Header */}
      <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e5e5e5' }}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Profile Picture */}
            <View style={{ position: 'relative' }}>
              <View style={{
                width: 64,
                height: 64,
                backgroundColor: '#4CAF50',
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                  {userType === 'mechanic' ? (user?.fullName ? user.fullName.charAt(0) : 'JS') : 'CS'}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 24,
                  height: 24,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="camera" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
                {user.fullName || 'Sem Nome'}
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>
                {user.role === 'MECHANIC' ? 'Mecânico' : 'Produtor Rural'}
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>
                {profile.specialty || 'Sem especialidade'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>
                  {userType === 'mechanic' ? '4.8 (127 avaliações)' : '4.9 (45 avaliações)'}
                </Text>
              </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity style={{ padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
              <Icon name="edit" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {/* Personal Information */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
            {userType === 'mechanic' ? 'Informações Profissionais' : 'Informações da Propriedade'}
          </Text>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e5e5e5',
          }}>
            {userType === 'mechanic' ? (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#e5e5e5' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      backgroundColor: '#e3f2fd',
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <MaterialIcons name="settings" size={20} color="#1976D2" />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontWeight: '600', color: '#333' }}>Especialidades</Text>
                      <Text style={{ color: '#666' }}>Tratores, Colheitadeiras</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#e5e5e5' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      backgroundColor: '#e8f5e9',
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <MaterialIcons name="place" size={20} color="#388E3C" />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontWeight: '600', color: '#333' }}>Área de Atendimento</Text>
                      <Text style={{ color: '#666' }}>Ribeirão Preto - 50km raio</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </>
            ) : (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#e5e5e5' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      backgroundColor: '#e1f5fe',
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <MaterialIcons name="map" size={20} color="#0288D1" />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontWeight: '600', color: '#333' }}>Fazenda Santa Rita</Text>
                      <Text style={{ color: '#666' }}>Ribeirão Preto, SP</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#e5e5e5' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      backgroundColor: '#fff3e0',
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <MaterialIcons name="local-farm" size={20} color="#FF9800" />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontWeight: '600', color: '#333' }}>Cultivos</Text>
                      <Text style={{ color: '#666' }}>Soja, Milho, Café</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Logout */}
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            onPress={showDialog}
            style={{
              backgroundColor: '#FFCDD2',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="sign-out" size={20} color="#D32F2F" />
            <Text style={{ fontWeight: '600', color: '#D32F2F', marginTop: 8 }} >
              Sair da Conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Confirmation Dialog */}
      <Dialog.Container visible={visible}>
        <Dialog.Title>Confirmação</Dialog.Title>
        <Dialog.Description>
          Você tem certeza que deseja sair?
        </Dialog.Description>
        <Dialog.Button label="Cancelar" onPress={hideDialog} />
        <Dialog.Button label="Confirmar" onPress={handleLogout} />
      </Dialog.Container>
    </View>
  );
}
