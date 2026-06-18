import React from 'react';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useCredentials } from 'src/common/hook/useCredentials';
import GooglePlaceSearchWeb from 'src/submodules/mapservicesfe/src/components/AddressSearch/components/GooglePlaceSearchWeb';
import { MapThemeProvider } from 'src/submodules/mapservicesfe/src/context/ThemeContext';

export const CustomGooglePlacesAutocomplete = (
  props: ICustomGooglePlacesAutocompleteProps
) => {
  const credentials = useCredentials();
  const {theme : themestyle} =useAppTheme()
  if (!credentials) {
    return null; // or null until key is loaded
  }

  return (
    <MapThemeProvider theme={{    primaryColor: themestyle.colors.textBody,
    background: themestyle.colors.surfaceBase,
    fontFamily: themestyle.fontFamily.medium,
   }}>
    <GooglePlaceSearchWeb
      {...props}
      googleApiKey={credentials.googleApiKey}
      crossIcon={true}
    />
    </MapThemeProvider>
  );
};

export type GooglePlacesAutocompleteRef = {
  setAddressText(address: string): void;
  getAddressText(): string;
  getCurrentLocation: () => void;
} & typeof TextInput;

interface ICustomGooglePlacesAutocompleteProps {
  onPlaceSelect: (
    details: string,
    lat: number,
    lng: number,
    placeApiData: GooglePlaceDetail | google.maps.places.PlaceResult | null
  ) => void;
  initialAddress?: string;
  error?: string;
  countryBound?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onClear?: () => void;
  onEnterPress?: () => void;
}

export default CustomGooglePlacesAutocomplete;
