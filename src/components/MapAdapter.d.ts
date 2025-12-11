declare module '@components/MapAdapter' {
  export type LatLng = { latitude: number; longitude: number };
  export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  export const MapView: any;
  export const Marker: any;
  export const Callout: any;
}
