import React from 'react';

// tipos duplicados para não importar de react-native-maps em arquivos web
export type LatLng = { latitude: number; longitude: number };
export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

type MapProps = {
  style?: any;
  region: Region;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  children?: React.ReactNode;
};
type MarkerProps = {
  coordinate: LatLng;
  title?: string;
  description?: string;
  pinColor?: string;
};

export function MapView({ style, region, showsUserLocation, showsMyLocationButton, children }: MapProps) {
  const MapViewRN = require('react-native-maps').default;
  return (
    <MapViewRN
      style={style}
      initialRegion={region}
      region={region}
      showsUserLocation={!!showsUserLocation}
      showsMyLocationButton={!!showsMyLocationButton}
    >
      {children}
    </MapViewRN>
  );
}

export function Marker({ coordinate, title, description, pinColor }: MarkerProps) {
  const { Marker: RNMarker } = require('react-native-maps');
  return (
    <RNMarker coordinate={coordinate} title={title} description={description} pinColor={pinColor} />
  );
}
