import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import color from '../../../common/assets/styles/color';
import { getValue, GooglePlacesAutocompleteRef, IAddressDetails, IAddressInfo, ISearchIconInfo } from '../../../common/utils/addressMobileUtil';
import { useTheme } from '../../../context/ThemeContext';
import mapStyles from '../../../styles/mapStyles';

interface IGooglePlaceSearchMobileProps{
    googleApiKey: string;
    onPlaceSelect: (details: string,latitude: number,longitude: number) => void;
    autoFocus: boolean;
    initialAddress?: string;
    label?: string;
    onChangeAddressText?: (data: IAddressInfo, type: string) => void;
    searchLeftIcon?: ISearchIconInfo;
    searchRightIcon?: ISearchIconInfo;
}

const GooglePlaceSearchMobile = (props: IGooglePlaceSearchMobileProps) => {
    const {
        googleApiKey,
        onPlaceSelect,
        autoFocus = false,
        initialAddress,
        label='Search Address',
        onChangeAddressText,
        searchLeftIcon: { name: leftName = 'search', color: leftColor = color.color_545454.color } = {},
        searchRightIcon: { name: rightName = 'close', color: rightColor = color.color_000000.color } = {},

    } = props;
    const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
    const [address, setAddress] = useState<string>('');
    const [showList, setShowList] = useState(false);
    const theme = useTheme();
    const styles = mapStyles(theme);
    const [data,setData] = useState<IAddressDetails>({
        city: '',
        state: '',
        country:'',
        pinCode: '',
        countryCode: ''
    });

    useEffect(() => {
        setAddress(initialAddress || '');
        if (initialAddress && autocompleteRef.current) {
          autocompleteRef.current.setAddressText(initialAddress);
        }
      }, [initialAddress]);
      
    useEffect(() => {
        if (onChangeAddressText) {
            onChangeAddressText({
            address,
            addressDetails: {
                city: getValue(data.city),
                state: getValue(data.state),
                country: getValue(data.country),
                pinCode: getValue(data.pinCode),
                countryCode: getValue(data.countryCode)
            }
            },'address');
        }
    },[address]);

    useEffect(() => {
        if (onChangeAddressText) {
            onChangeAddressText({
            address,
            addressDetails: {
                city: getValue(data.city),
                state: getValue(data.state),
                country: getValue(data.country),
                pinCode: getValue(data.pinCode),
                countryCode: getValue(data.countryCode)
            }
            },'data');
        }
    },[data]);
    const fetchAddressSections = (details: GooglePlaceDetail | null) => {
    let localityLongName = '';
    let administrativeLevel1LongName = '';
    let sublocalityLongName = '';
    let townLongName = '';
    let pinCode = '';
    let country = '';
    let countryCode= '';
    let state = '';

    setData((prevData:IAddressDetails) => ({
      ...prevData,
      city: '',
      state: '',
      country: '',
      pinCode: '',
      countryCode: ''
    }));

    details?.address_components.forEach((component) => {
      const { types, long_name ,short_name } = component;

      if (types.includes('postal_code') || types.includes('plus_code')) {
        pinCode = long_name;
      }

      if (types.includes('country')) {
        country = long_name;
      }

      if (types.includes('country')) {
        countryCode = short_name;
      }

      if (types.includes('administrative_area_level_1')) {
        administrativeLevel1LongName = long_name;
        state = long_name;
      }

      if (types.includes('locality')) {
        localityLongName = long_name;
      }

      if (types.includes('sublocality')) {
        sublocalityLongName = long_name;
      }

      if (types.includes('postal_town')) {
        townLongName = long_name;
      }
    });

    let city = localityLongName;

    if (!city || city === administrativeLevel1LongName) {
      if (sublocalityLongName) {
        city = sublocalityLongName;
      } else if (!city && !sublocalityLongName && townLongName) {
        city = townLongName;
      }
    }

    setData((prevData:IAddressDetails) => ({
      ...prevData,
      city,
      state,
      country,
      pinCode,
      countryCode
    }));
    
    if (onChangeAddressText) {
      onChangeAddressText({
        address: address,
        addressDetails: {
          city,
          state,
          country,
          pinCode,
          countryCode
        },
      },'data');
    }
  }

  const handlePlaceSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (data && details ) {
 
      const formattedAddress = data.description;
      const latitude = details.geometry.location.lat;
      const longitude = details.geometry.location.lng;
      setAddress(formattedAddress);
      autocompleteRef.current?.setAddressText(formattedAddress);
      onPlaceSelect(formattedAddress,latitude,longitude);
    }
 
    if (onChangeAddressText && details && details?.address_components.length > 0) {
      fetchAddressSections(details);
    }
 
  };

  const renderAutoSuggestionContent = (rowData: GooglePlaceData) => {

    const { structured_formatting } = rowData;
    const { main_text, secondary_text } = structured_formatting;
    const secondaryText = secondary_text || main_text;

    return (
      <View style={styles.suggestionRow}>
        <Ionicons name='search' size={18} color={color.color_000000.color} style={styles.suggestionicon} />
        <View style={styles.searchTxtWrap}>
          <Text style={styles.mainText}>{main_text}</Text>
          <Text style={styles.secondaryText}>{secondaryText}</Text>
        </View>
      </View>
    );
  };

  const renderLeftButton = (icon: ISearchIconInfo) => {
    const {name, color} = icon;
    return (
      <View style={styles.iconContainer}>
        <Ionicons name={name} size={18} color={color} />
      </View>
    );
  };

  const renderRightButton = (icon: ISearchIconInfo) => {
    const {name, color} = icon;
    return (
      <>
      {address.length > 0 && 
      <Pressable
        onPress={() => {
          setAddress('');
          autocompleteRef.current?.setAddressText('');
          setData({
            city: '',
            state: '',
            country:'',
            pinCode: '',
            countryCode: ''
            })
          }}
        style={{position: 'absolute',right:'1%',top:'20%',left:'auto',bottom:0}}  
      >
        <Ionicons name={name} size={25} color={color} />
      </Pressable>}
      </>
    )
  }
    return (
    <View style={{height: 50}}>
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          minLength={2}
          placeholder={label}
          listViewDisplayed={showList}
          onPress={handlePlaceSelect}
          fetchDetails={true}
          query={{
            key: googleApiKey,
            language: 'en',
          }}
          styles={{
            listView: {
              ...styles.customGoogleListView,
              ...styles.customGoogleSearchList
            }
          }}
          textInputProps={{
            value: address,
            onChangeText: (text) => setAddress(text),
            placeholderTextColor: color.color_676767.color,
            style: styles.textInput,
            autoFocus: autoFocus,
            onFocus: () => setShowList(true),
            onBlur: () => setShowList(false)
          }}
          renderLeftButton={() => renderLeftButton({name: leftName,color: leftColor})}
          renderRightButton={() => renderRightButton({name: rightName,color: rightColor})}
          enablePoweredByContainer={false}
          debounce={500}
          disableScroll={false}
          renderRow={renderAutoSuggestionContent}
          predefinedPlaces={[]}
          timeout={20000}
          keyboardShouldPersistTaps='handled'
        />
      </View>
  )
}

export default GooglePlaceSearchMobile;