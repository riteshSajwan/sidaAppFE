import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { View, ImageSourcePropType, Image } from 'react-native';
import { Marker, Polyline, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CustomErrorModalSelector from '../../common/components/CustomErrorModalSelector/CustomErrorModalSelector';
import { IAvailableRider, ILocationInfo } from '../../common/model/map';
import { useTheme } from '../../context/ThemeContext';
import mapStyles from '../../styles/mapStyles';
import MapComponent from './MapComponent';
import color from '../../common/assets/styles/color';
import MapView from 'react-native-maps';
import { generateCurvedPolyline, getBearing, getMidpoint } from '../../common/utils/locationDetailsUtil';

interface IMapRouteProps {
  sourceLocation: Region | undefined;
  destinationLocation: ILocationInfo;
  googleApiKey: string;
  yourLocationLabel?: string;
  destinationLocationLabel?: string;
  fetchPathErrorMessage?: string;
  isOutOfZone?: boolean;
  stopPoints?: ILocationInfo[];
  sourceImageUrl?: ImageSourcePropType;
  destinationImageUrl?: ImageSourcePropType;
  wayPointImageUrl?: ImageSourcePropType;
  heading?: number;
  listOfAvailableRiders?: IAvailableRider[];
  routeColor?: string;
  zoomRequire?: boolean;
  showAerialDistance?: boolean;
  fitToScreen?: boolean;
}
const default_Source_Image = require('../../common/assets/images/source.png');
const default_Destination_Image = require('../../common/assets/images/destination.png');
const default_Route_Color = color.color_FF5722.color;

const MapRoute: FunctionComponent<IMapRouteProps> = ({
  sourceLocation,
  destinationLocation,
  googleApiKey,
  yourLocationLabel = 'Your Location',
  destinationLocationLabel = 'Destination',
  fetchPathErrorMessage = 'Error in fetching route',
  isOutOfZone = false,
  stopPoints,
  sourceImageUrl = default_Source_Image,
  destinationImageUrl = default_Destination_Image,
  wayPointImageUrl = default_Destination_Image,
  heading,
  listOfAvailableRiders,
  routeColor = default_Route_Color,
  zoomRequire = false,
  showAerialDistance = false,
  fitToScreen = false, 
}: IMapRouteProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const theme = useTheme();
  const styles = mapStyles(theme);
  const mapRef = useRef<MapView>(null);


  useEffect(() => {
    if (sourceLocation?.latitude && sourceLocation?.longitude && zoomRequire) {
      mapRef?.current?.animateToRegion({
        latitude: Number(sourceLocation?.latitude),
        longitude: Number(sourceLocation?.longitude),
        latitudeDelta: sourceLocation.latitudeDelta,
        longitudeDelta: sourceLocation.longitudeDelta,
      });
    }
  }, [sourceLocation?.latitude, sourceLocation?.longitude]);
  
useEffect(() => {
  if (!mapRef.current || !sourceLocation || !destinationLocation || !showAerialDistance) return;

  mapRef.current.fitToCoordinates(
    [
      {
        latitude: sourceLocation.latitude,
        longitude: sourceLocation.longitude,
      },
      {
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
      },
    ],
    {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    }
  );

  const timeoutId = setTimeout(() => {
    const bearing = getBearing(
      { latitude: sourceLocation.latitude, longitude: sourceLocation.longitude },
      { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude }
    );

    let desiredHeading = bearing - 90;

    desiredHeading = ((desiredHeading % 360) + 360) % 360;

    const midpoint = getMidpoint(
      { latitude: sourceLocation.latitude, longitude: sourceLocation.longitude },
      { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude }
    );

    mapRef.current?.animateCamera(
      {
        center: {
          latitude: midpoint.latitude,
          longitude: midpoint.longitude,
        },
        heading: desiredHeading,
        pitch: 0,
      },
      { duration: 700 }
    );
  }, 700);

  return () => clearTimeout(timeoutId);
}, [
  sourceLocation?.latitude,
  sourceLocation?.longitude,
  destinationLocation?.latitude,
  destinationLocation?.longitude,
  showAerialDistance,
]);

const fitMapToAllPoints = () => {
  if (!mapRef.current || !sourceLocation || !destinationLocation) return;

  const coordinates = [
    {
      latitude: sourceLocation.latitude,
      longitude: sourceLocation.longitude,
    },
    {
      latitude: destinationLocation.latitude,
      longitude: destinationLocation.longitude,
    },
  ];

  if (stopPoints && stopPoints.length > 0) {
    stopPoints.forEach((p) =>
      coordinates.push({
        latitude: p.latitude,
        longitude: p.longitude,
      })
    );
  }

  mapRef.current.fitToCoordinates(coordinates, {
    edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
    animated: true,
  });
};

useEffect(() => {
  if (!fitToScreen) return;
  fitMapToAllPoints();
}, [
  fitToScreen,
  sourceLocation?.latitude,
  sourceLocation?.longitude,
  destinationLocation?.latitude,
  destinationLocation?.longitude,
  stopPoints?.length,
]);


  const onClose = () => {
    setVisible(false);
  };

  if (!sourceLocation) {
    return <View />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapComponent
        ref={mapRef}
        initialRegion={sourceLocation}
        mapStyle={[
          styles.mapCommonLayout,
          isOutOfZone ? styles.NoDeliveryMaplayout : styles.maplayout,
        ]}
      >
        {sourceLocation && (
          <Marker
            coordinate={{
              latitude: sourceLocation.latitude,
              longitude: sourceLocation.longitude,
            }}
            title={yourLocationLabel}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={
              sourceImageUrl !== default_Source_Image &&
              typeof heading === 'number'
                ? (heading + 90) % 360
                : 0
            }
            flat={true}
          >
            <Image
              key={`source-${sourceImageUrl}`}
              source={sourceImageUrl}
              resizeMode="contain"
              style={{ height: 35, width: 35 }}
            />
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
                <Image
                  source={rider.pointImage}
                  resizeMode="contain"
                  style={{ height: 35, width: 35 }}
                />
              </Marker>
            ))
          : null}
        {stopPoints &&
          stopPoints.length > 0 &&
          stopPoints.map((point, index) => (
            <Marker
              key={`waypoint-${index}`}
              coordinate={point}
              title={`Stop ${index + 1}`}
            >
              <Image
                key={`destination-${wayPointImageUrl}`}
                source={wayPointImageUrl}
                resizeMode="contain"
                style={{ height: 35, width: 35 }}
              />
            </Marker>
          ))}
        {destinationLocation && (
          <Marker
            coordinate={destinationLocation}
            title={destinationLocationLabel}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={0}
          >
            <Image
              key={`destination-${destinationImageUrl}`}
              source={destinationImageUrl}
              resizeMode="contain"
              style={{ height: 35, width: 35 }}
            />
          </Marker>
        )}

        {showAerialDistance && sourceLocation && destinationLocation && (
          <Polyline
            coordinates={generateCurvedPolyline(
              {
                latitude: sourceLocation.latitude,
                longitude: sourceLocation.longitude,
              },
              {
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              },
              0.45, // curvature (tweak)
              80, // smoothing points (tweak)
            )}
            strokeColor={routeColor}
            strokeWidth={3}
            lineDashPattern={[5, 10]}
            geodesic={false} // keep false since we manually curve in lat/lon space
          />
        )}
        {destinationLocation && sourceLocation && !showAerialDistance && (
          <MapViewDirections
            origin={{
              latitude: sourceLocation.latitude,
              longitude: sourceLocation.longitude,
            }}
            destination={destinationLocation}
            apikey={googleApiKey}
            strokeWidth={5}
            strokeColor={routeColor}
            mode="DRIVING"
            precision="low"
            timePrecision="none"
            waypoints={stopPoints}
            optimizeWaypoints={true}
            resetOnChange={false}
            onError={() => setVisible(true)}
            onReady={(result) => {
              if (fitToScreen) {
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
                  animated: true,
                });
              }
            }}
          />
        )}
      </MapComponent>
      <CustomErrorModalSelector
        visible={visible}
        onClose={onClose}
        message={fetchPathErrorMessage}
      />
    </View>
  );
};

export default MapRoute;
