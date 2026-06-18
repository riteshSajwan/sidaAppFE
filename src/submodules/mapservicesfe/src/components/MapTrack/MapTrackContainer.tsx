import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Dimensions, View, ImageSourcePropType } from 'react-native';
import { Region } from 'react-native-maps';
import { ILocationInfo } from '../../common/model/map';
import MapRoute from './MapRoute';
import { requestLocationPermission } from '../../common/utils/locationPermissionUtil';
import { ISocketConnectionProps} from '../../common/utils/socketConnectionUtil';
import color from '../../common/assets/styles/color';
import { getBearing, moved_100m, time_interval } from '../../common/utils/locationDetailsUtil';

interface IMapTrackContainerProps {
  sourceLocation: Region | undefined;
  googleApiKey: string;
  destinationLocation: ILocationInfo;
  sourceImageUrl?: ImageSourcePropType;
  destinationImageUrl?: ImageSourcePropType;
  fetchPathErrorMessage?: string;
  yourLocationLabel?: string;
  destinationLocationLabel?: string;
  socketConnectionData?: ISocketConnectionProps;
  routeColor?: string;
  zoomRequire?: boolean;
  updatedLocation?:(data:ILocationInfo)=>void;
}

const default_Route_Color = color.color_FF5722.color;

const MapTrackContainer: FunctionComponent<IMapTrackContainerProps> = ({
  sourceLocation,
  googleApiKey,
  destinationLocation,
  sourceImageUrl = require('../../common/assets/images/source.png'),
  destinationImageUrl = require('../../common/assets/images/destination.png'),
  fetchPathErrorMessage = 'Error in fetching route',
  yourLocationLabel='Your Location',
  destinationLocationLabel='Destination',
  socketConnectionData,
  routeColor = default_Route_Color,
  zoomRequire = false,
  updatedLocation

}: IMapTrackContainerProps) => {
  const prevLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const accumulatedProgressRef = useRef<number>(0);
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [currentHeading, setCurrentHeading] = useState(0);

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = width / height;
    const latitudeDelta = 0.1;
    const longitudeDelta = latitudeDelta * aspectRatio;
    setCurrentLocation({
      latitude: Number(sourceLocation?.latitude),
      longitude: Number(sourceLocation?.longitude),
      latitudeDelta,
      longitudeDelta,
    });
    requestLocationPermission()
    .then((granted) => {
      if (granted) {
        return startLocationTracking();
      }
    })
    .catch((error) => {
      console.error('Error setting up location tracking:', error);
    });

    return () => {
      if (fgSubscription) {
        fgSubscription.remove();
      }
    };
  }, [destinationLocation]);

  let fgSubscription: Location.LocationSubscription | null = null;

  const startLocationTracking = async () => {
    try {
      fgSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: moved_100m,
          timeInterval: time_interval,
        },
        (newLocation) => {
          const newCoords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          let heading = newLocation.coords.heading ?? 0;
          if (prevLocationRef.current) {
            heading = getBearing(prevLocationRef.current, newCoords);
          }
          if (prevLocationRef.current && destinationLocation) {
            const movedDistance = getDistance(
              prevLocationRef.current,
              newCoords
            );
            accumulatedProgressRef.current += movedDistance;
            if (accumulatedProgressRef.current >= moved_100m && updatedLocation) {
              accumulatedProgressRef.current = 0;
              updatedLocation(newCoords)
            }
            accumulatedProgressRef.current = 0;
          }
          prevLocationRef.current = newCoords;
          setCurrentLocation((prev) =>
            prev ? { ...prev, ...newCoords } : null
          );
          setCurrentHeading(heading);
        }
      );
    } catch (error) {
      console.warn('error in location update', error);
    }
  };

  function renderMapSection() {
    if (!currentLocation) {
      return null;
    }

    return (
      <MapRoute
        sourceLocation={currentLocation}
        destinationLocation={destinationLocation}
        googleApiKey={googleApiKey}
        fetchPathErrorMessage={fetchPathErrorMessage}
        sourceImageUrl={sourceImageUrl}
        destinationImageUrl={destinationImageUrl}
        heading={currentHeading}
        yourLocationLabel={yourLocationLabel}
        destinationLocationLabel={destinationLocationLabel}
        routeColor={routeColor}
        zoomRequire={zoomRequire}
      />
    );
  }

  return <View style={{ flex: 1 }}>{renderMapSection()}</View>;
};

export default MapTrackContainer;
