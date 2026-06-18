import React, { useEffect, useRef } from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { IAvailableRider } from '../../common/model/map';
import { useTheme } from '../../context/ThemeContext';
import mapStyles from '../../styles/mapStyles';
import MapComponent from './MapComponent';

interface INearByMarkers {
  sourceLocation: Region | undefined;
  isOutOfZone?: boolean;
  sourceLocationLabel?: string;
  sourceImageUrl?: ImageSourcePropType;
  listOfAvailableRiders?: IAvailableRider[];
  onSourceLocationChange?: (location: Region) => void;
  zoomRequired?: boolean;
}

const NearByMarkersMap = ({
  sourceLocation,
  isOutOfZone,
  sourceLocationLabel = 'Your Location',
  sourceImageUrl = require('../../common/assets/images/source.png'),
  listOfAvailableRiders,
  onSourceLocationChange,
  zoomRequired = false
}: INearByMarkers) => {
  const theme = useTheme();
  const styles = mapStyles(theme);
  const onRegionChangeComplete = (region: Region) => {
    onSourceLocationChange && onSourceLocationChange(region);
  };
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (sourceLocation?.latitude && sourceLocation?.longitude && zoomRequired) {
      mapRef?.current?.animateToRegion({
        latitude: Number(sourceLocation?.latitude),
        longitude: Number(sourceLocation?.longitude),
        latitudeDelta: sourceLocation.latitudeDelta,
        longitudeDelta: sourceLocation.longitudeDelta,
      });
    }
  }, [sourceLocation?.latitude, sourceLocation?.longitude]);

  return (
    <>
      <MapComponent
        initialRegion={sourceLocation}
        mapStyle={[
          styles.mapCommonLayout,
          isOutOfZone ? styles.NoDeliveryMaplayout : styles.maplayout,
        ]}
        onRegionChangeComplete={onRegionChangeComplete}
        ref={mapRef}
      >
        {sourceLocation && !onSourceLocationChange && (
          <Marker
            coordinate={{
              latitude: sourceLocation.latitude,
              longitude: sourceLocation.longitude,
            }}
            title={sourceLocationLabel}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
          >
            <Image source={sourceImageUrl} resizeMode='contain' style={{height:35,width:35}}/>
          </Marker>
        )}
        {listOfAvailableRiders && listOfAvailableRiders.length > 0
          ? listOfAvailableRiders.map((rider) => (
              <Marker
                key={rider.id}
                coordinate={{
                  latitude: rider.latitude,
                  longitude: rider.longitude,
                }}
              >
                <Image source={rider.pointImage} resizeMode='contain' style={{height:35,width:35}}/>
              </Marker>
            ))
          : null}
      </MapComponent>
      {onSourceLocationChange && sourceLocation && (
        <View pointerEvents='none' style={styles.sourceIconView}>
          <Image
            source={sourceImageUrl}
            style={{ width: 48, height: 48 }}
            resizeMode='contain'
          />
        </View>
      )}
    </>
  );
};

export default NearByMarkersMap;
