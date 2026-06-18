import * as Location from 'expo-location';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const requestCurrentLocationWithCordinates = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});

    if (!location?.coords) {
      console.error('Could not retrieve location coordinates');
      return null;
    }

    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  } catch (error) {
    console.error('Error fetching current location:', error);
    return null;
  }
};