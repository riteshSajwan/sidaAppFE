import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View, } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import { useTipStyle } from 'src/common/assets/styles/tip';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomMultiSelectDropdown from 'src/common/components/CustomDropdown/CustomMutliSelectDropdown';
import CustomSnackbar, {
    SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchAllCountriesListAction, fetchCountryDetailsAction, saveCountryAction } from 'src/common/service/country/action';
import { getAllPaymentMethod } from 'src/common/service/country/api';
import { fetchCountryDetailsSuccess, resetCountryDetails } from 'src/common/service/country/slice';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import {
    generateInitialCountryData,
    generateInitialErrorsData,
    IAddCountry,
    ICountryErrors,
    validateCountry
} from 'src/components/ManageServiceAreas/ManageActiveCountries/add/AddCountryUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const AddCountry = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const tipStyle = useTipStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [countryData, setCountryData] = useState<IAddCountry>({
    ...generateInitialCountryData(),
  });
  const [infoError, setInfoError] = useState<ICountryErrors>({
    ...generateInitialErrorsData(),
  });
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const defaultTip = '1';
  const tipOptions = ['1', '3', '5', '10'];
  const [selectedTip, setSelectedTip] = useState(defaultTip);
  const [isCustom, setIsCustom] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<IMinuteOption[]>();
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
  const { countryId } = useLocalSearchParams<{
    countryId: string;
  }>();

  const {data:selectedCountry ,loading,error , allUnregisteredCountrylist: allCountries , snackbarVisible } = useSelector((state: RootState) => state.country.countryDetails);

  const focus = useIsFocused();

  const onChangeDropdown = (item: IMinuteOption, name: string) => {
    setCountryData({ ...countryData, [name]: item.value });
  };

  const handleDismiss = () => {
    router.push(Routes.COUNTRIES);
  };
  const fetchCountries = async () => {
      dispatch(fetchAllCountriesListAction())
  };


  const handleSubmit = async () => {
    setSubmitClicked(true);
    const { isValid, errors } = validateCountry(selectedCountry);
    setInfoError(errors);
    if (isValid) {
      const payload: IAddCountry = {
        ...selectedCountry,
        timezone: selectedCountry.timezones?.[0] ?? '',
        primaryTimezone: selectedCountry.timezones?.[0] ?? '',
      };
      dispatch(saveCountryAction(payload));
    }
  };

  const handleChange = (fieldName: string) => (text: string) => {
    dispatch((fetchCountryDetailsSuccess({ ...selectedCountry, [fieldName]: text })));
  };

  useEffect(() => {
    if (submitClicked) {
      const { errors } = validateCountry(countryData);
      setInfoError(errors);
    }
  }, [countryData]);

  useEffect(() => {
    if (focus) {
      fetchCountries();
      // fetchPaymentList()
    } else {
      reset();
    }
    return () => {
    dispatch(resetCountryDetails());

    }
  }, [focus]);

  const reset = () => {
    setCountryData({ ...generateInitialCountryData() });
    setInfoError({ ...generateInitialErrorsData() });
    setSubmitClicked(false);
    setAvailableTimezones([]);
  };
  useEffect(() => {
    if (countryId && focus) {
      fetchCountryData(countryId);
    }
  }, [countryId, focus]);

  useEffect(() => {
    if (!selectedCountry?.countryISO || availableTimezones.length > 0) return;

    // use timezones array from edit API response directly
    const tz = selectedCountry?.timezones;
    const tzArray = Array.isArray(tz) ? tz : tz ? [tz] : [];

    // fallback to master country list if API didn't return timezones
    const masterCountry = allCountries?.find(c => c.countryISO === selectedCountry.countryISO);
    const fullTimezones = tzArray.length > 0
      ? tzArray
      : (masterCountry?.timezones ?? (selectedCountry.timezone ? [selectedCountry.timezone] : []));

    if (fullTimezones.length > 0) {
      setAvailableTimezones(fullTimezones);
    }

    // set selected from timezone field
    const selected = selectedCountry.primaryTimezone ?? selectedCountry.timezone ?? '';
    if (selected) {
      dispatch(fetchCountryDetailsSuccess({
        ...selectedCountry,
        timezones: [selected],
      }));
    }
  }, [selectedCountry?.countryISO, allCountries]);

  const fetchCountryData = async (id: string) => {
      dispatch((fetchCountryDetailsAction(id)))
  };


  const fetchPaymentList = async () => {
    try {
      const result: string[] = await getAllPaymentMethod();
      const transformedData = result.map((item) => ({
        label: item,
        value: item,
      }));
      setPaymentMethod([
        // { label: TranslateMessage('Admin.Delivery.App.Select'), value: '' },
        ...transformedData,
      ]);
    } catch (error) { }
  };

  const handleCancel = () => {
    router.push(Routes.COUNTRIES);
  };

  const handleTipSelection = (amount: string) => {
    setSelectedTip(amount);
    setIsCustom(amount === '');
    setCountryData({ ...countryData, ['tip']: amount ? amount : defaultTip });
  };

  const getButtonStyle = (amount: string) => {
    return amount === selectedTip
      ? [tipStyle.btnOuter, tipStyle.selectedBtn]
      : tipStyle.btnOuter;
  };

  const getTextStyle = (amount: string) => {
    return amount === selectedTip
      ? [tipStyle.btnTxt, tipStyle.selectedText]
      : tipStyle.btnTxt;
  };
  const handlePaymentMethodChange = (items: IMinuteOption[]) => {
    const values = items.map(item => item.value);
    dispatch(fetchCountryDetailsSuccess( {
      ...selectedCountry,
      paymentMethods: values,
    }));
  };
  

  function renderCountryName() {
    return (
      <View style={[formStyle.width48]}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Country.Name')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        {
          !countryId ?
            <Dropdown
              style={[
                { height: 48 },
                layout.dropdown,
              ]}
              placeholderStyle={layout.placeholderStyle}
              selectedTextStyle={[
                layout.placeholderStyle,
                selectedCountry.countryName !== '' && layout.selectedTextStyle,
              ]}
              inputSearchStyle={[layout.inputSearchStyle]}
              data={allCountries || []}
              disable={!!countryId}
              labelField='countryName'
              valueField='countryISO'
              placeholder={
                selectedCountry.countryName || TranslateMessage('Admin.Delivery.App.Select.Country')
              }
              value={selectedCountry.countryName}
              search
              onChange={(item) => {
                setAvailableTimezones(item.timezones ?? []);
                dispatch(fetchCountryDetailsSuccess({
                  ...item,
                  timezones: item.primaryTimezone
                    ? [item.primaryTimezone]
                    : (item.timezones ?? []),
                }));
              }}
              searchPlaceholder={TranslateMessage('Admin.Delivery.App.SearchLabel')}
              renderItem={(item) => (
                <View style={{ padding: theme.spacing.sm }}>
                  {/* <Text style={{color: theme.colors.textBody}}>{item.countryName}</Text> */}
                  <Typography variant='body'>{item.countryName}</Typography>
                </View>
              )}
              containerStyle={{backgroundColor: theme.colors.surfaceBase}}
            />

            : <TextInput
              style={[
                formStyle.inputField,
                infoError.countryISO != '' && formStyle.errorBorderColor,
              ]}
              placeholder={TranslateMessage(
                'Admin.Delivery.App.Select.Country'
              )}
              placeholderTextColor={theme.colors.textNeutral}
              disabled
              value={selectedCountry.countryName}
              mode='outlined'
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderErrorInverse}
              outlineColor={theme.colors.borderMedium}
              secureTextEntry={false}
              contentStyle={formStyle.inputPlaceholderLabel}
            />

        }


        {renderErrorMsg(infoError.countryName)}
      </View>
    );
  }
  function renderPaymentMethod() {
    return (
      <View style={[formStyle.width48]}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Payment.Method')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <CustomMultiSelectDropdown
          data={paymentMethod ?? []}
          selectedValues={
            (paymentMethod ?? []).filter(option =>
              selectedCountry.paymentMethods?.includes(option.value)
            )
          }
          onChange={handlePaymentMethodChange}
        />


        {renderErrorMsg(infoError.payment)}
      </View>
    );
  }
  function renderTimezones() {
    const timezoneOptions: IMinuteOption[] = availableTimezones.map(tz => ({ label: tz, value: tz }));
    const selectedTimezone = selectedCountry.timezones?.[0]
      ? { label: selectedCountry.timezones[0], value: selectedCountry.timezones[0] }
      : { label: TranslateMessage('Admin.Delivery.App.Select'), value: '' };

    return (
      <View style={[formStyle.width48]}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Country.Timezones')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <Customdropdown
          data={timezoneOptions}
          selectedValue={selectedTimezone}
          onChange={(item: IMinuteOption) => {
            dispatch(fetchCountryDetailsSuccess({
              ...selectedCountry,
              timezones: [item.value],
            }));
            setInfoError((prev: ICountryErrors) => ({ ...prev, timezones: '' }));
          }}
          style={layout.dropdownHeight}
        />
        {renderErrorMsg(infoError.timezones)}
      </View>
    );
  }

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderCurrency() {
    return (
      <View style={[formStyle.width48]}>
        <View>
          <Text
            style={[formStyle.labelTitle]}>
            {TranslateMessage('Admin.Delivery.App.Country.Currency')}
          </Text>

          <TextInput
            style={[
              formStyle.inputField,
              infoError.countryISO != '' && formStyle.errorBorderColor,
            ]}
            placeholder={TranslateMessage(
              'Admin.Delivery.App.Country.Currency'
            )}
            placeholderTextColor={theme.colors.textNeutral}
            onChangeText={handleChange('countryISO')}
            disabled
            value={selectedCountry.currency}
            mode='outlined'
            autoCapitalize='none'
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            secureTextEntry={false}
            contentStyle={formStyle.inputPlaceholderLabel}
          />
          {renderErrorMsg(infoError.countryISO)}
        </View>
      </View>
    );
  }

  function renderDistanceUnit() {
    return (
      <View style={[formStyle.width48]}>
        <Text
          style={[formStyle.labelTitle]}
        >
          {TranslateMessage('Admin.Delivery.App.Country.DistanceUnit')}
        </Text>
        <TextInput
          style={[
            formStyle.inputField,
            infoError.distanceUnit !== '' && formStyle.errorBorderColor,
          ]}
          placeholder={TranslateMessage(
            'Admin.Delivery.App.Country.DistanceUnit'
          )}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={handleChange('distanceUnit')}
          value={selectedCountry.distanceUnit}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          disabled
          contentStyle={formStyle.inputPlaceholderLabel}
        />
        {renderErrorMsg(infoError.distanceUnit)}
      </View>
    );
  }

  function renderCountryISO() {
    return (
      <View style={[formStyle.width48]}>
        <Loader loading={loading} />
        <View>
          <Text
            style={[formStyle.labelTitle]}>
            {TranslateMessage('Admin.Delivery.App.Country.CountryISO')}
          </Text>

          <TextInput
            style={[
              formStyle.inputField,
              infoError.countryISO != '' && formStyle.errorBorderColor,
            ]}
            placeholder={TranslateMessage(
              'Admin.Delivery.App.Country.CountryISO.Placeholder'
            )}
            placeholderTextColor={theme.colors.textNeutral}
            onChangeText={handleChange('countryISO')}
            disabled
            value={selectedCountry.countryISO}
            mode='outlined'
            autoCapitalize='none'
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            secureTextEntry={false}
            contentStyle={formStyle.inputPlaceholderLabel}
          />
          {renderErrorMsg(infoError.countryISO)}
        </View>
      </View>
    );
  }

  const renderTipButton = (amount: string) => {
    const formattedAmount = amount === '' ? countryData.tip : `${countryData.currency} ${amount}`;
    return (
      <Pressable style={getButtonStyle(amount)} key={amount} onPress={() => handleTipSelection(amount)}>
        <Text style={getTextStyle(amount)}>
          {amount === '' ? TranslateMessage('Admin.Delivery.App.Custom') : formattedAmount}
        </Text>
      </Pressable>
    );
  };

  const [checked, setChecked] = useState(false);
  function renderTipSection() {
    return (
      <View style={[formStyle.width48]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[formStyle.labelTitle, { marginRight: 10, marginBottom: 10 }]}>{TranslateMessage('Admin.Delivery.App.Country.Tip')}</Text>
         
          {/* <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => setChecked(!checked)}
            color={color.btn_primary_color.color}
          /> */}
        </View>
        <View style={[formStyle.checkWrap]}>
          <TextInput
            style={[formStyle.inputField, formStyle.w200]}
            mode='outlined'
            autoCapitalize='none'
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            placeholderTextColor={theme.colors.textNeutral}
            placeholder={TranslateMessage('Admin.Delivery.App.Country.Tip.Placeholder')}
            value={selectedCountry.tip??''}
            onChangeText={handleChange('tip')}
            maxLength={3}
            keyboardType='numeric'
            right={<TextInput.Affix text={` ${selectedCountry.currency}`} />}
            />

          {renderErrorMsg(infoError.tip)}
        </View>
      </View>
    )
  }

  return (
    <>
    <ScrollView>
      <View style={[layout.paddinghor17]}>
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
            layout.flexWrap,
          ]}>
          <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.Country.Heading')}</Typography>
          <View style={styles.breadcrumbContainer}>
            <Text style={styles.breadcrumb}>
              {TranslateMessage('Admin.Delivery.App.Home')}
            </Text>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb]}>
              {TranslateMessage('Admin.Delivery.App.Country.Heading')}
            </Text>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
              {TranslateMessage('Admin.Delivery.App.Restaurants.AddNewTitle')}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom30]} />
        <View style={[layout.cardBox,]}>
          <View style={styles.headerContainer}>
            <Text style={[layout.accordionTitle, layout.marBottom30]}>
              {TranslateMessage('Admin.Delivery.App.Country.Heading')}
            </Text>
          </View>
          <View>
            <View style={[formStyle.formRow]}>
              {renderCountryName()}
              {renderCurrency()}
            </View>

            <View style={[formStyle.formRow]}>
              {renderDistanceUnit()}
              {renderCountryISO()}
            </View>
            {
              selectedCountry.countryName ?
            <View style={[formStyle.formRow]}>
              {/* {renderPaymentMethod()} */}
              {renderTimezones()}
              {/* {renderTipSection()} */}
            </View>
            :null
            }
          </View>
          {renderErrorMsg(error ?? '')}
          <View style={[formStyle.formRow, { justifyContent: 'flex-end' }]}>
            <View style={[formStyle.formCol50, formStyle.formRow,{ justifyContent: 'flex-end',marginRight:10 }]}>
              <View style={[formStyle.formCol50]}>
                <Pressable onPress={handleSubmit}>
                  <Text
                    style={[button.btnBase, button.btnPrimary]}
                  >
                    {TranslateMessage('Admin.Delivery.App.SaveBtnTitle')}
                  </Text>
                </Pressable>
              </View>
              <View style={[formStyle.formCol50]}>
                <Pressable onPress={handleCancel}>
                  <Text
                    style={[
                        button.btnBase,
                      button.btnOutlineDanger,
                     
                    ]}
                  >
                    {TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
                  </Text>
                </Pressable>
              </View>
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
     </ScrollView> 
    </>
    
  );
};

export default AddCountry;
