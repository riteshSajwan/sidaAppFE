import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import color from '../../common/assets/styles/color';
import { useTheme } from '../../context/ThemeContext';
import mapStyles from '../../styles/mapStyles';
import {
  IAddressInfo,
  ISearchIconInfo,
  SearchType,
} from '../../common/utils/addressMobileUtil';
import GooglePlaceSearchMobile from './components/GooglePlaceSearchMobile';

interface ICustomGooglePlacesAutocompleteProps {
  onChangeAddressText?: (data: IAddressInfo, type: string) => void;
  onPlaceSelect: (details: string, latitude: number, longitude: number) => void;
  googleApiKey: string;
  initialAddress?: string;
  addressSearchType?: string;
  autoFocus?: boolean;
  searchLeftIcon?: ISearchIconInfo;
  searchRightIcon?: ISearchIconInfo;
  destinationLeftIcon?: ISearchIconInfo;
  destinationRightIcon?: ISearchIconInfo;
  yourLocationLabel?: string;
  destinationLocationLabel?: string;
}

const AddressSearchMobile: React.FC<ICustomGooglePlacesAutocompleteProps> = (
  props: ICustomGooglePlacesAutocompleteProps
) => {
  const {
    onChangeAddressText,
    onPlaceSelect,
    googleApiKey,
    initialAddress,
    yourLocationLabel = 'Search Address',
    destinationLocationLabel = 'Destination Address',
    addressSearchType = SearchType.PRIMARY,
    autoFocus = true,
    searchLeftIcon: {
      name: leftName = 'search',
      color: leftColor = color.color_545454.color,
    } = {},
    searchRightIcon: {
      name: rightName = 'close',
      color: rightColor = color.color_000000.color,
    } = {},
    destinationLeftIcon: {
      name: leftDestinationName = 'search',
      color: leftDestinationColor = color.color_545454.color,
    } = {},
    destinationRightIcon: {
      name: rightDestinationName = 'close',
      color: rightDestinationColor = color.color_000000.color,
    } = {},
  } = props;
  const theme = useTheme();
  const styles = mapStyles(theme);

  return (
    <View
      style={[
        styles.flexCol,
        styles.mt30,
        styles.p10,
        { position: 'relative' },
      ]}
    >
      {addressSearchType === SearchType.PRIMARY ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.flexCol, { position: 'relative' }]}>
            <GooglePlaceSearchMobile
              googleApiKey={googleApiKey}
              autoFocus={autoFocus}
              label={yourLocationLabel}
              onPlaceSelect={onPlaceSelect}
              initialAddress={initialAddress}
              onChangeAddressText={onChangeAddressText}
              searchLeftIcon={{ name: leftName, color: leftColor }}
              searchRightIcon={{ name: rightName, color: rightColor }}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={[styles.flexColumn, styles.flexCol, styles.bothAddressBox]}
          >
            <GooglePlaceSearchMobile
              googleApiKey={googleApiKey}
              autoFocus={autoFocus}
              label={yourLocationLabel}
              onPlaceSelect={onPlaceSelect}
              initialAddress={initialAddress}
              onChangeAddressText={onChangeAddressText}
              searchLeftIcon={{ name: leftName, color: leftColor }}
              searchRightIcon={{ name: rightName, color: rightColor }}
            />
            <GooglePlaceSearchMobile
              googleApiKey={googleApiKey}
              autoFocus={false}
              label={destinationLocationLabel}
              onPlaceSelect={onPlaceSelect}
              initialAddress={initialAddress}
              onChangeAddressText={onChangeAddressText}
              searchLeftIcon={{
                name: leftDestinationName,
                color: leftDestinationColor,
              }}
              searchRightIcon={{
                name: rightDestinationName,
                color: rightDestinationColor,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};
export default AddressSearchMobile;
