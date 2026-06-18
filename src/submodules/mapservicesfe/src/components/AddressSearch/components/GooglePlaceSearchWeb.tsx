import React, { useEffect, useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { ScrollView, View } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import color from '../../../common/assets/styles/color';
import { useTheme } from '../../../context/ThemeContext';
import mapStyles from '../../../styles/mapStyles';

interface IGooglePlaceSearchWebProps {
  onPlaceSelect: (details: string, lat: number, lng: number, placeApiData: google.maps.places.PlaceResult | null) => void;
  googleApiKey: string,
  initialAddress?: string;
  error?: string;
  countryBound?: string;
  disabled?: boolean;
  placeholderLabel?: string
  crossIcon?: boolean;
}

const GooglePlaceSearchWeb: React.FC<IGooglePlaceSearchWebProps> = ({
  onPlaceSelect ,
  googleApiKey,
  initialAddress,
  error = '',
  countryBound = '',
  disabled = false,
  placeholderLabel = 'Search Address',
  crossIcon = false,
}:IGooglePlaceSearchWebProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const theme = useTheme();
  const styles = mapStyles(theme);

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: googleApiKey,
    debounce: 500,
  });

  useEffect(() => {
    setInputValue(initialAddress ?? '');

  }, [initialAddress]);

  const handlePlaceSelect = (
    data: google.maps.places.AutocompletePrediction,
    details: google.maps.places.PlaceResult | null,
  ) => {
    if (data || details) {
      const formattedAddress = data.description;
      const latitude = details?.geometry?.location?.lat() ?? 0;
      const longitude = details?.geometry?.location?.lng() ?? 0;
      onPlaceSelect(formattedAddress, latitude, longitude, details);
    }
  };

  const onAddressSelectHandler = (
    item: google.maps.places.AutocompletePrediction
  ) => {
    const { description, place_id } = item;
    setInputValue(description);
    setShowPredictions(false);

    placesService?.getDetails(
      {
        placeId: place_id,
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
        language: 'en',
      },
      (placeDetails: google.maps.places.PlaceResult | null) => {
        if (placeDetails) {
          handlePlaceSelect(item, placeDetails);
        }
      }
    );
  };

  const renderItem = (item: google.maps.places.AutocompletePrediction) => (
    <List.Item
      key={item.place_id}
      title={item.description}
      titleStyle={color.color_000000}
      onPress={() => onAddressSelectHandler(item)}
    />
  );

  const handleChangeText = (text: string) => {
    setInputValue(text);
    setShowPredictions(true);
    getPlacePredictions({
      input: text,
      types: [],
      ...(countryBound && {
        componentRestrictions: { country: countryBound },
      }),
      language: 'en',
    });
  };

  return (
    <View style={styles.flexCol}>
        <View style={{position:'relative'}}>
          <View style={{ width: '100%' }}>
            <TextInput
              style={[
                styles.inputField,
                {
                  borderColor: error
                    ? color.color_EB3C36.color
                    : color.textfield_border_color.color,

                    backgroundColor:disabled ? color.color_F1EDED.color :''
                },

                
                
              ]}
              mode='outlined'
              autoCapitalize='none'
              activeOutlineColor={color.color_EB3C36.color}
              outlineColor={color.textfield_border_color.color}
              contentStyle={styles.inputPlaceholderLabel}
              placeholderTextColor={color.textfield_placeholder_color.color}
              value={inputValue}
              placeholder={placeholderLabel}
              onChangeText={handleChangeText}
              onFocus={() => setShowPredictions(true)}
              onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
              right={
                (inputValue.length  > 0  && crossIcon )? (
                  <TextInput.Icon
                    icon="close"
                    onPress={() => {
                      setInputValue('');
                      setShowPredictions(false);
                    }}
                  />
                ) : null
              }
              disabled={disabled}
            />

            {showPredictions &&
              !isPlacePredictionsLoading &&
              placePredictions.length > 0 && (
                <View style={styles.addressList}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    <List.Section>
                      {placePredictions.map((prediction) => renderItem(prediction))}
                    </List.Section>
                  </ScrollView>
                </View>
              )}
          </View>
        </View>
    </View>
  );
};

export default GooglePlaceSearchWeb;
