// app/_layout.tsx
import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../src/store/auth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { token, user, loading, rehydrate } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => { rehydrate(); }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!token || !user) {
      if (!inAuth) router.replace('/login');               
    } else {
      if (inAuth) {
        router.replace(user.role === 'PRODUCER' ? '/producer' : '/mechanic');
      }
    }
  }, [token, user, loading, segments]);

  if (loading) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator/></View>;
  }
  return <Slot />;
}
