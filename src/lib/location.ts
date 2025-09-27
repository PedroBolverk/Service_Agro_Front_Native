import * as Location from 'expo-location';
import { Platform } from 'react-native';

// pega a posição atual uma vez
export async function getCurrent(): Promise<{ lat: number; lng: number }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Permissão de localização negada');
  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { lat: coords.latitude, lng: coords.longitude };
}

// observa posição continuamente
export async function watchPosition(
  onUpdate: (lat: number, lng: number) => void,
  opts?: { timeMs?: number; distM?: number }
): Promise<() => void> {
  const sub = await Location.watchPositionAsync(
    {
      accuracy:
        Platform.OS === 'ios'
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
      timeInterval: opts?.timeMs ?? 3000,
      distanceInterval: opts?.distM ?? 10,
    },
    (u) => {
      onUpdate(u.coords.latitude, u.coords.longitude);
    }
  );
  return () => sub.remove();
}
