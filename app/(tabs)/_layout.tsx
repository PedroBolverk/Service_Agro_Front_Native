import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../src/store/auth';

export default function TabsLayout() {
  const { user } = useAuth();

  // Exibe a aba "Serviços" apenas para produtores
  const isProducer = user?.role === 'PRODUCER';

  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false }}>
      {/* Dashboard / Home */}
      <Tabs.Screen
        name="index" // arquivo: app/(tabs)/index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Serviços (somente para produtores) */}
      {isProducer && (
        <Tabs.Screen
          name="serviceselection"
          options={{
            href: null,
            title: 'Serviços',
            tabBarIcon: ({ color, size }) => (
              <Feather name="list" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Mapa */}
      <Tabs.Screen
        name="map" // arquivo: app/(tabs)/map.tsx
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="profile" // arquivo: app/(tabs)/profile.tsx
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
