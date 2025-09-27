// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Feather name="home" size={24} color="black" /> // Ícone Feather para Home
        ),
      }} />

      <Tabs.Screen name="serviceselection" options={{
        title: 'Serviços',
        tabBarIcon: ({ color, size }) => (
          <Feather name="list" size={24} color="black" /> // Ícone Feather para Home
        ),
      }} />
      <Tabs.Screen name="map" options={{
        title: 'Mapa',
        tabBarIcon: ({ color, size }) => (
          <Feather name="map" size={24} color="black" /> // Ícone Feather para Home
        ),
      }} />

      <Tabs.Screen name="explore" options={{ title: 'Perfil',
        tabBarIcon: ({ color, size }) => (
          <Feather name="user" size={24} color="black" /> // Ícone Feather para Home
        ), }} />
    </Tabs >
  );
}
