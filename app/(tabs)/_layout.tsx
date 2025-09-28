import { Tabs } from 'expo-router'; // Importa o componente Tabs do expo-router
import { Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs>
      {/* Dashboard Tab */}
      <Tabs.Screen
        name="index" // Nome da rota para a tela inicial
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      {/* Service Selection Tab */}
      <Tabs.Screen
        name="serviceselection" // Nome da rota para a tela de serviços
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      {/* Map Tab */}
      <Tabs.Screen
        name="map" // Nome da rota para a tela de mapa
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile" // Nome da rota para a tela de perfil
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
