import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';

// Types for address components and geocode result
export interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface AddressDetails {
  cityName: string;
  stateName: string;
  postal: string;
}

export interface IGeocodeResult {
  formatted_address: string;
  address_components: IAddressComponent[];
  types: string[];
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
}

export const getPlaceDetails = async (placeId: string, googlePlaceApiKey:string): Promise<GooglePlaceDetail | null> => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googlePlaceApiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === 'OK') {
      return data.result;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const doesComponentMatch = (
  components: IAddressComponent[],
  typeChecks: string[],
  label?: string
): boolean => {
  const normalizeString = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Normalize and remove diacritics

  return components.some(
    (component) =>
      typeChecks.some((type) => component.types.includes(type)) &&
      normalizeString(component.long_name) === normalizeString(label ?? '')
  );
};

export const getCountryName = (addressComponents: IAddressComponent[]) => {
  for (const component of addressComponents) {
    if (component.types.includes('country')) {
      return { countryName: component.long_name, countryISO: component.short_name };
    }
  }
  return { countryName: '', countryISO: '' };
}

export const cityTypeChecks = [
  'sublocality_level_1',
  'postal_town',
  'sublocality',
  'administrative_area_level_3',
  'administrative_area_level_2',
  'locality',
];

export const countryTypeChecks = [
  'country',
];

export const extractAddressDetails = async (
  addressComponents: IAddressComponent[],
  lat: number,
  lng: number,
): Promise<{ cityName: string, stateName: string, postal: string }> => {
  const details = {
    cityName: '',
    stateName: '',
    postal: '',
  };

  addressComponents.forEach((component) => {
    if (component.types.includes('locality')) {
      details.cityName = component.long_name;
    } else if (component.types.includes('administrative_area_level_1')) {
      details.stateName = component.long_name;
    }
  });

  if (!details.postal) {
    try {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };
      const result = await geocoder.geocode({ location: latlng })
          if (result.results?.[0]) {
            result.results[0]?.address_components.forEach((component: IAddressComponent) => {
              if (component.types.includes('postal_code')) {
                details.postal = component.long_name;
              }
            });
          }
    } catch (error) {
      console.error('Error fetching postal code:', error);
    }
  }
  return details;
};