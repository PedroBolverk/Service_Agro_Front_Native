declare module 'react-native-navigation-directions' {
  export function OpenMapDirections(
    startPoint: { latitude: number; longitude: number },
    endPoint: { latitude: number; longitude: number },
    transportType?: 'd' | 'w' | 'r' | 'b'
  ): Promise<any>;
}
