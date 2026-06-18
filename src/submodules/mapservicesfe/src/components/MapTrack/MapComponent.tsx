import React, { ReactNode, Ref } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

interface IMapProps {
  initialRegion: Region | undefined;
  mapStyle?: StyleProp<ViewStyle>;
  onRegionChangeComplete?: (region: Region) => void;
  children?: ReactNode;
  ref?: Ref<MapView>;
}

const MapComponent = ({
  initialRegion,
  mapStyle,
  onRegionChangeComplete,
  children,
  ref = null,
}: IMapProps) => {
  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      style={mapStyle}
      initialRegion={initialRegion}
      onRegionChangeComplete={onRegionChangeComplete}
      rotateEnabled={true}
      showsUserLocation={false}
      followsUserLocation={false}
      showsCompass={false}
      showsTraffic={false}
      loadingEnabled={true}
      moveOnMarkerPress={false}
      showsBuildings={true}
      userLocationPriority='low'
    >
      {children}
    </MapView>
  );
};

export default MapComponent;
