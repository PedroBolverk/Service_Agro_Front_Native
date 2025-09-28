import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../lib/api';

type Role = 'PRODUCER' | 'MECHANIC';

export type User = {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  specialty: string;
  producer?: { // Aqui estamos assumindo que o produtor pode ter algumas informações específicas.
    photoUrl?: string;
    // Outros campos que você pode precisar para o produtor
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
        await SecureStore.setItemAsync(TOKEN_KEY, legacyToken);
        await SecureStore.deleteItemAsync('svcagro/token');
      }
      if (legacyUser) {
        await AsyncStorage.setItem(USER_KEY, legacyUser);
        await AsyncStorage.removeItem('svcagro/user');
      }

      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await AsyncStorage.getItem(USER_KEY);
      const user = userStr ? JSON.parse(userStr) as User : null;

      setAuthToken(token || null);
      set({ token: token || null, user, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (!res?.token) throw new Error('Token ausente na resposta de login');

    await SecureStore.setItemAsync(TOKEN_KEY, String(res.token));
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));

    setAuthToken(res.token);
    set({ token: res.token, user: res.user });
  },

  signUp: async (p) => {
    await api('/usuarios', { method: 'POST', body: p });
    await get().signIn(p.email, p.password);
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setAuthToken(null);
    set({ token: null, user: null });
  },
}));
