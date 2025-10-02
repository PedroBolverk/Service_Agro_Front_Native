import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../lib/api';  // Importando a função setAuthToken

type Role = 'PRODUCER' | 'MECHANIC';

export type User = {
  id: string;
  email: string;
  role: Role;
  token: string | null;
  fullName: string;
  specialty: string;
  producer?: { 
    photoUrl?: string;
  };
};

const TOKEN_KEY = 'svcagroToken';
const USER_KEY = 'svcagroUser';

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  rehydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (p: { email: string; password: string; fullName: string; role: Role; mechanicSpecialty?: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: true,

  rehydrate: async () => {
    try {
      const legacyToken = await SecureStore.getItemAsync('svcagro/token').catch(() => null);
      const legacyUser = await AsyncStorage.getItem('svcagro/user').catch(() => null);

      if (legacyToken) {
        console.log('Token encontrado no SecureStore:', legacyToken);
        await SecureStore.setItemAsync(TOKEN_KEY, legacyToken);
        await SecureStore.deleteItemAsync('svcagro/token');
      }

      if (legacyUser) {
        console.log('Usuário encontrado no AsyncStorage:', legacyUser);
        await AsyncStorage.setItem(USER_KEY, legacyUser);
        await AsyncStorage.removeItem('svcagro/user');
      }

      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await AsyncStorage.getItem(USER_KEY);
      const user = userStr ? JSON.parse(userStr) : null;

      console.log('Token reidratado:', token);
      console.log('Usuário reidratado:', user);

      setAuthToken(token || null);  // Configura o token globalmente usando setAuthToken
      set({ token: token || null, user, loading: false });

    } catch (error) {
      set({ loading: false });
      console.error('Erro ao reidratar:', error);
    }
  },

  signIn: async (email, password) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (!res?.token) throw new Error('Token ausente na resposta de login');
    console.log('Token recebido no login:', res.token);

    // Salvando o token e o usuário nos storages
    await SecureStore.setItemAsync(TOKEN_KEY, String(res.token));
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));

    // Verificando se o token foi armazenado
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('Token armazenado no SecureStore:', token);

    // Verificando se o usuário foi armazenado
    const userStr = await AsyncStorage.getItem(USER_KEY);
    console.log('Usuário armazenado no AsyncStorage:', userStr);

    setAuthToken(res.token);  // Passa o token para a configuração global
    set({ token: res.token, user: res.user });
  },

  signUp: async (p) => {
    await api('/usuarios', { method: 'POST', body: p });
    await get().signIn(p.email, p.password);
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setAuthToken(null);  // Remove o token globalmente
    set({ token: null, user: null });
  },
}));
