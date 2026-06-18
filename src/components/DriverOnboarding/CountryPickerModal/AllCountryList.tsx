import { countries, getEmojiFlag, TCountryCode } from 'countries-list';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useCountryStyles } from 'src/components/DriverOnboarding/CountryPickerModal/CountryListStyle';
import { useCountryPickerStyles } from 'src/components/DriverOnboarding/CountryPickerModal/CountryPickerModalStyle';
import { Icon } from 'src/submodules/iconlibrary/src';

export interface ICountryData {
  name: string;
  native: string;
  code: TCountryCode;
  callingCodes?: number[];
}

interface ICountryModalProps {
  countryCode: TCountryCode | null;
  onSelect: (selectedCountry: ICountryData) => void;
  modalVisible: boolean;
  toggleModal: () => void;
}

const AllCountryList: FunctionComponent<ICountryModalProps> = ({
  countryCode,
  onSelect,
  modalVisible,
  toggleModal,
}) => {
  const [filteredCountries, setFilteredCountries] = useState<ICountryData[]>(
    [],
  );
  const [searchedCountries, setSearchedCountries] = useState<ICountryData[]>(
    [],
  );

  const [loadedItems, setLoadedItems] = useState<number>(0);
  const [sizePerPage] = useState<number>(20);
  const [totalSize] = useState<number>(Object.keys(countries).length);
  const [filterText, setFilterText] = useState<string>('');
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const selectedCountryRef = useRef<ICountryData | null>(null);
  const { t: TranslateMessage } = useTranslation();
  const formStyle = useFormStyle();
  const countryStyles = useCountryStyles();
  const { theme } = useAppTheme();
  const styles = useCountryPickerStyles();
  const loadAllCountries = () => {
    const countryData: ICountryData[] = Object.entries(countries).map(
      ([code, country]) => ({
        name: country.name,
        native: country.native,
        code: code as TCountryCode,
        callingCodes: country.phone || [],
      }),
    );
    setFilteredCountries(countryData);
  };

  useEffect(() => {
    if (modalVisible) {
      //loadCountryData(loadedItems, sizePerPage); Rquired in future
      loadAllCountries();
    }
  }, [loadedItems, modalVisible]);

  const loadCountryData = (loadedItems: number, sizePerPage: number) => {
    const countryData: ICountryData[] = Object.entries(countries)
      .slice(loadedItems, loadedItems + sizePerPage)
      .map(([code, country]) => ({
        name: country.name,
        native: country.native,
        code: code as TCountryCode,
        callingCodes: country.phone || [],
      }));

    setFilteredCountries((prev) => [...prev, ...countryData]);
  };

  const handleSelect = (item: ICountryData) => {
    selectedCountryRef.current = item;
    onSelect(item);
    toggleModalProp();
  };

  const toggleModalProp = () => {
    if (!modalVisible) {
      setFilteredCountries([]);
      setFilterText('');
      setSearchActive(false);
      setLoadedItems(0);
    }
    toggleModal();
  };

  const handleEndReached = () => {
    if (loadedItems < totalSize) {
      setLoadedItems((prev) => prev + sizePerPage);
    }
  };
  useEffect(() => {
    if (searchActive) {
      const filtered = filteredCountries.filter((country) =>
        country.name.toLowerCase().includes(filterText.toLowerCase()),
      );
      setSearchedCountries(filtered);
    } else {
      setSearchedCountries(filteredCountries);
    }
  }, [filterText, filteredCountries, searchActive]);

  return (
    <View
      style={[
        styles.countryView,
        { backgroundColor: theme.colors.surfaceBase },
      ]}
    >
      <View style={countryStyles.filterContainer}>
        <TextInput
          style={[
            formStyle.inputField,
            { width: '100%', position: 'relative' },
          ]}
          mode='outlined'
          activeOutlineColor={theme.colors.borderLinkInverse}
          outlineColor={theme.colors.borderMedium}
          outlineStyle={{ borderRadius: theme.roundness.sm }}
          placeholder={TranslateMessage('Admin.Delivery.App.Search.Country')}
          placeholderTextColor={theme.colors.textInverse}
          value={filterText}
          onChangeText={(text) => {
            setFilterText(text);
            setSearchActive(text.length > 0);
          }}
          contentStyle={formStyle.formInput}
        />
        {filterText.length > 0 && (
          <Pressable
            onPress={() => setFilterText('')}
            style={countryStyles.clearButton}
          >
            <Text allowFontScaling={false} style={countryStyles.clearText}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>
      {searchedCountries.length === 0 && !!filterText ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text allowFontScaling={false} style={[{ textAlign: 'center' }]}>
            {TranslateMessage('Admin.Delivery.App.NoCountriesAvailable')}
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={searchedCountries}
          keyboardShouldPersistTaps='handled'
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.countryItem}
              onPress={() => handleSelect(item)}
            >
              <View style={styles.countrycheckbox}>
                <View style={styles.countryflaglist}>
                  <Text allowFontScaling={false} style={styles.flag}>
                    {getEmojiFlag(item.code as TCountryCode)}
                  </Text>
                  <Text allowFontScaling={false} style={styles.countryName}>
                    {item.name}
                  </Text>
                </View>

                {item.code === countryCode && (
                  <View style={styles.squareRadioButton}>
                    <Icon name='tick' color={theme.colors.iconInverse} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.code + index}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          style={styles.flatList}
        />
      )}
    </View>
  );
};

export default AllCountryList;
