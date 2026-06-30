import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import CustomGooglePlacesAutocomplete from 'src/common/components/CustomGooglePlacesAutocomplete/CustomGooglePlacesAutocomplete';
import CustomSnackbar, {
    SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchCityDetailsAction, saveCityAction } from 'src/common/service/city/action';
import { resetCityDetails } from 'src/common/service/city/slice';
import { fetchCountryDetailsAction } from 'src/common/service/country/action';
import { checkIfEmpty } from 'src/components/Business/add/addBusinessUtils';
import {
    generateInitialCityData,
    generateInitialErrorsData,
    IAddCity,
    ICityErrors,
    ITaxInfo,
    validateCity
} from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/add/AddCityUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { MAX_CHECK_LENGTH } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const AddCity = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();

  const [cityData, setCityData] = useState<IAddCity>({
    ...generateInitialCityData(),
  });

  
  const [infoError, setInfoError] = useState<ICityErrors>({
    ...generateInitialErrorsData(),
  });
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const {data:countryData  ,error:countryError} = useSelector((state: RootState) => state.country.countryDetails);
    const {data:detailsResult ,loading,error , snackbarVisible } = useSelector((state: RootState) => state.city.cityDetails);
  

  
  const scrollViewRef = useRef<ScrollView>(null);
  const focus = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();

  const { countryId, id } = useLocalSearchParams<{
    countryId: string;
    id: string;
  }>();

  const MemoizedGooglePlacesAutocomplete = useMemo(() => (
    CustomGooglePlacesAutocomplete
  ), [cityData.cityName]);

  const handlePlaceSelect = async (
    formatted_address: string,
    lat: number,
    lng: number
  ) => {
    setCityData((prevState) => ({
      ...prevState,
      cityName: formatted_address,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleChange = (fieldName: string) => (text: string) => {
    setCityData({ ...cityData, [fieldName]: text });
  };

  const handleDismiss = () => {
    router.push(`${Routes.COUNTRIES}/${countryId}${Routes.CITIES}`);
  };

  const handleBack = () => {
    router.push(`${Routes.COUNTRIES}/${countryId}${Routes.CITIES}`);
  };

  const handleTaxInfoChange =
    (fieldName: string, index: number) => (text: string) => {
      setCityData((prevState) => {
        const updatedTaxInfo = [...prevState.taxes];
        updatedTaxInfo[index] = {
          ...updatedTaxInfo[index],
          [fieldName]: text,
        };
        return { ...prevState, taxes: updatedTaxInfo };
      });
    };

  const handleSubmit = async () => {
    setSubmitClicked(true);
    const { isValid, errors } = validateCity(cityData);
    setInfoError(errors);
    if (isValid) {
        dispatch(saveCityAction(cityData))
    }
  };


  const handleRemoveTaxRow = (index: number) => () => {
    const updatedTaxInfo = [...cityData.taxes];
    const updatedTaxInfoErrors = [...infoError.taxes];
    const taxId = cityData.taxes[index].id;
    if (taxId) {
      updatedTaxInfo[index].deleted = true;
      updatedTaxInfoErrors[index] = { taxName: '', taxPercentage: '' };
    } else {
      updatedTaxInfo.splice(index, 1);
      updatedTaxInfoErrors.splice(index, 1);
    }
    setCityData({ ...cityData, taxes: updatedTaxInfo });
    setInfoError({ ...infoError, taxes: updatedTaxInfoErrors });
  };

  useEffect(() => {
    if (submitClicked) {
      const { errors } = validateCity(cityData);
      setInfoError(errors);
    }
  }, [cityData]);

  useEffect(()=>{
    if(detailsResult){
       const processedTaxes = (detailsResult.taxes ?? []).map((tax: ITaxInfo) => ({
        taxName: tax.taxName.trim() || '',
        taxPercentage: tax.taxPercentage.toString() || '',
        id: tax.id,
        deleted: tax.deleted
      }));

      const processedResult: IAddCity = {
        ...detailsResult,
        taxes: processedTaxes, // Set processed taxes
      };
      const taxesErrors = processedResult.taxes.map(() => ({
        taxName: '',
        taxPercentage: '',
      }));
       setInfoError((prevState) => ({
        ...prevState,
        taxes: taxesErrors,
      }));
      setCityData(processedResult)
    }
  },[detailsResult])

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    if (focus && countryId) {
      fetchCountries();
      setCityData({ ...cityData, countryId });
    } else {
      reset();
    }
  }, [focus, countryId]);


  const reset = () => {
    setCityData({ ...generateInitialCityData() });
    setInfoError({ ...generateInitialErrorsData() });
    setSubmitClicked(false);
  };

  useEffect(() => {
    if (id && focus) {
      fetchCityData(id);
    }
    return(()=>{dispatch(resetCityDetails());
    })
  }, [id, focus]);

  const fetchCityData = async (id: string) => {
    
    if(id === 'new'){
      return
    }
      dispatch((fetchCityDetailsAction(id)))
  };

  const fetchCountries = async () => {
      dispatch((fetchCountryDetailsAction(countryId)))
  };

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderCountry() {
    return (
      <View style={formStyle.width48}>
      <Text style={formStyle.labelTitle}>
      {TranslateMessage('Admin.Delivery.App.Country.Name')}
      </Text>
      <TextInput
        style={formStyle.inputField}
        placeholder=''
        placeholderTextColor={theme.colors.textNeutral}
        disabled
        contentStyle={formStyle.inputPlaceholderLabel}
        mode='outlined'
        autoCapitalize='none'
        activeOutlineColor={theme.colors.borderErrorInverse}
        outlineColor={theme.colors.borderMedium}
        secureTextEntry={false}
        value={countryData.countryName}
      />
    </View>
    );
  }

  function renderCityName() {
    return (
      <View style={[formStyle.width48]}>
          <Text style={[formStyle.labelTitle]}>
            {TranslateMessage('Admin.Delivery.App.City.Name')}
          </Text>
        
          <MemoizedGooglePlacesAutocomplete
            onPlaceSelect={handlePlaceSelect}
            initialAddress={cityData.cityName}
            error={infoError.cityName}
            countryBound={countryData.countryISO}
          />
          {renderErrorMsg(infoError.cityName)}
      </View>
    );
  }

  function renderRadius() {
    return (
      <View style={[formStyle.width48]}>
        <Text
          style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.City.Max.Distance')} (
          {countryData.distanceUnit})
        </Text>

        <TextInput
          style={formStyle.inputField}
          placeholderTextColor={theme.colors.textNeutral}
          mode='outlined'
          contentStyle={formStyle.inputPlaceholderLabel}
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          value={cityData.radius}
          onChangeText={handleChange('radius')}
        />
        {renderErrorMsg(infoError.radius)}
      </View>
    );
  }

  function renderTaxInfo() {
    return (
      <View style={{zIndex:-1}}>
        {cityData.taxes?.map((tax, index) => {
          if (tax.deleted) return null; 
          return (
            <View
              key={index}
              style={[
                formStyle.formRow,
                layout.alignCenter,formStyle.justifySpace]}>
              <View style={[formStyle.width48]}>
                  <Text style={[formStyle.labelTitle]}>
                    {TranslateMessage('Admin.Delivery.App.City.TaxName')}
                  </Text>
              
                  <TextInput
                    style={formStyle.inputField}
                    placeholder={TranslateMessage(
                      'Admin.Delivery.App.City.TaxName.Placeholder'
                    )}
                    placeholderTextColor={
                      theme.colors.textNeutral
                    }
                    contentStyle={formStyle.inputPlaceholderLabel}
                    mode='outlined'
                    autoCapitalize='none'
                    activeOutlineColor={
                      theme.colors.borderErrorInverse
                    }
                    outlineColor={theme.colors.borderMedium}
                    secureTextEntry={false}
                    value={tax.taxName}
                    onChangeText={handleTaxInfoChange('taxName', index)}
                    maxLength={MAX_CHECK_LENGTH}
                  />
                  {renderErrorMsg(
                    checkIfEmpty(infoError.taxes[index].taxName)
                  )} 
              </View>
              <View style={[formStyle.width48]}>
                <View
                  style={[formStyle.formRow, layout.mb0, layout.alignCenter]}
                >
                  <View style={[formStyle.formCol]}>
                    <Text style={[formStyle.labelTitle]}>
                      {TranslateMessage(
                        'Admin.Delivery.App.City.TaxPercentage'
                      )}
                    </Text>
                
                    <TextInput
                      style={formStyle.inputField}
                      placeholder={TranslateMessage(
                        'Admin.Delivery.App.City.TaxPercentage.Placeholder'
                      )}
                      placeholderTextColor={
                        theme.colors.textNeutral
                      }
                      contentStyle={formStyle.inputPlaceholderLabel}
                      mode='outlined'
                      autoCapitalize='none'
                      activeOutlineColor={
                        theme.colors.borderErrorInverse
                      }
                      outlineColor={theme.colors.borderMedium}
                      secureTextEntry={false}
                      value={tax.taxPercentage}
                      onChangeText={handleTaxInfoChange(
                        'taxPercentage',
                        index

                      )}
                    />
                    {renderErrorMsg(
                      checkIfEmpty(infoError.taxes[index].taxPercentage)
                    )}
                  </View>
                </View>
              </View>
              {/* {index === 0 ? (
                <IconButton
                  icon='plus-circle-outline'
                  iconColor={color.color_EB3C36.color}
                  size={35}
                  style={{
                    position: 'absolute',
                    width: 35,
                    height: 35,
                    right: 3,
                    bottom: 10,
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                  }}
                  onPress={handleAddTaxRow}
                />
              ) : (
                <IconButton
                  icon='minus-circle-outline'
                  iconColor={color.color_EB3C36.color}
                  size={35}
                  style={{
                    position: 'absolute',
                    width: 35,
                    height: 35,
                    right: 3,
                    bottom: 10,
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                  }}
                  onPress={handleRemoveTaxRow(index)}
                />
              )} */}
            </View>
          );
        })}
      </View>
    );
  }

  function renderRiderEarnings() {
    return (
      <View style={[formStyle.width48]}>
        <Text
          style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Riders.Earnings')}
        </Text>
      
        <View style={layout.customStyleField}>  
          <TextInput
            style={formStyle.inputField}
            placeholderTextColor={theme.colors.textNeutral}
            placeholder={TranslateMessage(
              'Admin.Delivery.App.Enter.Rider.Earnings'
            )}
            mode='outlined'
            contentStyle={formStyle.inputPlaceholderLabel}
            autoCapitalize='none'
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            secureTextEntry={false}
            value={cityData.riderSharePercent}
            onChangeText={handleChange('riderSharePercent')}
          />
          <Text style={[formStyle.labelTitle, { fontFamily: 'Barlow700' }]}>
            %
          </Text>
        </View>
        {renderErrorMsg(infoError.riderSharePercent)}
      </View>
    );
  }

  function renderMinServiceFee() {
    return (
      <View style={[formStyle.width48]}>
            <Text
              style={[formStyle.labelTitle]}>
              {TranslateMessage('Admin.Delivery.App.Country.Minimum.Service.Fee')} ({countryData?.currency})
            </Text>
            <TextInput
              style={formStyle.inputField}
              placeholder={TranslateMessage(
                'Admin.Delivery.App.Enter.Minimum.Service.Fee'
              )}
              placeholderTextColor={theme.colors.textNeutral}
              mode='outlined'
              contentStyle={formStyle.inputPlaceholderLabel}
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderErrorInverse}
              outlineColor={theme.colors.borderMedium}
              secureTextEntry={false}
              value={cityData.minServiceFee}
              maxLength={6}
              onChangeText={handleChange('minServiceFee')}
            />
            {renderErrorMsg(infoError.minServiceFee)}
          </View>
    );
  }

  function renderServiceFeePercentage() {
    return (
      <View style={[formStyle.width48]}>
        <Text
          style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Country.Service.Fee')}
        </Text>
        <View style={layout.customStyleField}>  
        <TextInput
          style={formStyle.inputField}
          placeholderTextColor={theme.colors.textNeutral}
          placeholder={TranslateMessage(
            'Admin.Delivery.App.Enter.Service.Fee'
          )}
          mode='outlined'
          contentStyle={formStyle.inputPlaceholderLabel}
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          value={cityData.serviceFeePercentage}
          onChangeText={handleChange('serviceFeePercentage')}
        />
         <Text style={[formStyle.labelTitle, { fontFamily: 'Barlow700' }]}>
            %
          </Text>
        </View>
        {renderErrorMsg(infoError.serviceFeePercentage)}
      </View>
    );
  }

  return (
    <ScrollView ref={scrollViewRef}>
      <Loader loading={loading} />
      <View style={layout.paddinghor17}>
      <View
        style={[
          layout.container,
          styles.headerContainer,
          layout.paddingTop26,
          layout.flexWrap,
        ]}
      >
        <View style={styles.filterrow}>
          <View>
            {/* <Pressable onPress={handleBack}>
              <IconButton
                icon='chevron-left'
                style={button.btnIcon}
                size={40}
                iconColor={theme.colors.iconBase}
              />
            </Pressable> */}
          </View>
          <View>
            <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
              {TranslateMessage('Admin.Delivery.App.City.Heading')}
            </Text>
          </View>
        </View>
        {/* Right Section (Breadcrumbs) */}
      </View>
      <Divider style={[layout.DividerSperator, layout.marBottom30]} />
      <View>
        <View style={[layout.MainLayout, layout.cardBox]}>
          <View style={styles.headerContainer}>
            <Text
              style={[layout.accordionTitle, layout.marBottom30, layout.fs24]}
            >
              {TranslateMessage('Admin.Delivery.App.City.Info')}
            </Text>
          </View>
          <View>
            <View style={[formStyle.formRow,formStyle.justifySpace]}>
              {renderCountry()}
              {renderCityName()}
            </View>
            <View style={[formStyle.formRow,formStyle.justifySpace,{zIndex:-1}]}>
              {renderRadius()}
            </View>
          </View>
          <View style={[styles.headerContainer,{zIndex:-1}]}>
            <Text
              style={[layout.accordionTitle, layout.marBottom30, layout.fs24]}
            >
              {TranslateMessage('Admin.Delivery.App.City.TaxInfo')}
            </Text>
          </View>
          {renderTaxInfo()}
          <View style={[formStyle.formRow,formStyle.justifySpace]}>
            {renderMinServiceFee()}
            {renderServiceFeePercentage()}
          </View>
          <View style={[formStyle.formRow,formStyle.justifySpace]}>
            {renderRiderEarnings()}
          </View>
          {renderErrorMsg(countryError ?? '')}
          {renderErrorMsg(error ?? '')}
        </View>
        <View style={[formStyle.formRow, { justifyContent: 'flex-end' }]}>
          <View style={[formStyle.formBtnRow, layout.alignRight]}>
            <View>
              <Pressable onPress={handleBack}>
                <Text
                  style={[button.btn, button.btnOutlinePrimary, { minWidth: 250 }]}
                >
                  {TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={[formStyle.formBtnRow, layout.alignRight]}>
            <View>
              <Pressable onPress={handleSubmit}>
                <Text style={[button.btn, button.btnPrimary, { minWidth: 250 }]}>
                  {TranslateMessage('Admin.Delivery.App.SaveBtnTitle')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <CustomSnackbar
        visible={snackbarVisible}
        message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
        onDismiss={handleDismiss}
        type={SnackbarType.SUCCESS}
      />
      </View>
    </ScrollView>
  );
};

export default AddCity;
