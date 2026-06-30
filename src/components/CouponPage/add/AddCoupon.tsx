import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, TextInput, Tooltip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { addCouponAction, fetchCouponDetailsAction } from 'src/common/service/coupon/action';
import { resetCouponDetails, setCouponSnackbar } from 'src/common/service/coupon/slice';
import { formatDateToMomentString } from 'src/common/utils/dateUtil';
import { ICouponErrors, ICouponTag, generateInitialCouponData, generateInitialErrorsData, validateCoupon } from 'src/components/CouponPage/add/AddCouponUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { DELAY_TOOLTIP } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';


const AddTags = () => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const { data: couponDetails, loading } = useSelector((state: RootState) => state.coupon.couponDetails);
  const { snackbarVisible} = useSelector((state: RootState) => state.coupon.couponListing);
  const {loading: saveLoading, error:SaveError } = useSelector((state: RootState) => state.coupon.couponSave);
  const [infoError, setInfoError] = useState<ICouponErrors>({
    ...generateInitialErrorsData(),
  });
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCoupon, setSelectedCoupon] = useState<ICouponTag>({
    ...generateInitialCouponData(),
  });
  const { couponId } = useLocalSearchParams<{
    couponId: string;
  }>();
  const focus = useIsFocused();
  const handleDismiss = () => {
    router.push(Routes.COUPON);
    dispatch(setCouponSnackbar(false));
  };
  useEffect(() => {
    if (SaveError) {
      setInfoError((prev) => ({ ...prev, apiError: SaveError }));
    }
  }, [SaveError]);

  useEffect(() => {
    if (couponId && focus) {
      fetchCouponData(couponId);
    } else {
      reset()
    }
    return(()=>{
      dispatch(resetCouponDetails());
    })
  }, [couponId, focus]);

  const fetchCouponData = async (id: string) => {
    dispatch(fetchCouponDetailsAction(id));
  };

  const reset = () => {
    setSelectedCoupon({ ...generateInitialCouponData() });
    setInfoError({ ...generateInitialErrorsData() });
    // dispatch(setCouponSnackbar(false));
  };
    useEffect(() => {
      if (couponDetails) {
        setSelectedCoupon(couponDetails);
      }
    }, [couponDetails]);

    const handleSubmit = () => {
      const { isValid, errors } = validateCoupon(selectedCoupon);
      setInfoError(errors);
      if (!isValid) return;
      const payload = {...selectedCoupon,expirationDateTime: formatDateToMomentString(selectedCoupon.expirationDateTime as DateType)};
      dispatch(addCouponAction(payload))

    };
    

  const handleChange = (fieldName: string) => (text: string | DateType | null) => {
    setSelectedCoupon({ ...selectedCoupon, [fieldName]: text });
  };

  const getNumericText = (text: string): string => {
    return text.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  };

  const handleCancel = () => {
    router.push(Routes.COUPON);
  };
  const handleNumeric = (label: string, text: string,) => {
    const numericText = getNumericText(text);
    handleChange(label)(numericText);
  }
  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderCouponName() {
    return (
     <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Coupon.Name')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.Name')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleChange('couponName')(text.replace(/\s/g, ''))}
          value={selectedCoupon.couponName}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        {renderErrorMsg(infoError.couponName)}
      </View>
    );
  }

   
  function renderAmount() {
    return (
      <View style={formStyle.formCol}>
        <View style={[layout.flexDirectionRow, {gap: theme.spacing.xs}]}>
          <Text style={[formStyle.labelTitle]}>
            {TranslateMessage('Admin.Delivery.App.Driver.Minimum.Order.Amount')}
            <Text style={formStyle.asteriskTxt}>*</Text>
          </Text>
          <Tooltip title={TranslateMessage('Admin.Delivery.App.Minimum.Offer.To.Avail')} leaveTouchDelay={DELAY_TOOLTIP}>
            <Icon name='infoOutline' color={theme.colors.iconBase} size={15}/>
          </Tooltip>
        </View>

        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.Amount')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            handleNumeric('minimumOrderValue', text,)
          }}
          value={selectedCoupon.minimumOrderValue ?? ''}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          maxLength={4}
          contentStyle={formStyle.inputPlaceholderLabel}
          keyboardType="numeric"
          inputMode="numeric"

        />

        {renderErrorMsg(infoError.minimumOrderValue)}
      </View>
    );
  }
  function renderFrenchName() {
    return (
       <View style={formStyle.formCol}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[formStyle.labelTitle]}>
            {TranslateMessage('Admin.Delivery.App.French.Name')}
            <Text style={formStyle.asteriskTxt}>*</Text>
          </Text>
        </View>

        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.Name')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleChange('couponFrenchName')(text.replace(/\s/g, ''))}
          value={selectedCoupon.couponFrenchName}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        {renderErrorMsg(infoError.couponFrenchName)}
      </View>
    );
  }
  function renderCouponValue() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Coupon.value.Percentage')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[
            formStyle.inputField]}
          placeholder={TranslateMessage(
            'Admin.Delivery.App.Enter.Coupon.value.Percentage'
          )}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            handleNumeric('couponDiscountPercent', text,)
          }}

          value={selectedCoupon.couponDiscountPercent}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
        />
        {renderErrorMsg(infoError.couponDiscountPercent)}
      </View>
    );
  }


  function formatDateToYYYYMMDD(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function renderExpixyDate() {
    return (
     <View style={formStyle.formCol}>
        <View style={layout.flexCol}>
          <Text style={[formStyle.labelTitle]}>
            {TranslateMessage(
              'Admin.Delivery.App.Coupon.Expiry.Date'
            )}
            <Text style={formStyle.asteriskTxt}>*</Text>
          </Text>

          <CustomInputDatePicker
            date={
              selectedCoupon.expirationDateTime
                ? formatDateToYYYYMMDD(selectedCoupon.expirationDateTime)
                : null
            }
            onDateSelect={(dateStr) => handleChange('expirationDateTime')(new Date(dateStr))}
            minDate={formatDateToYYYYMMDD(new Date())}
            placeholder={'Date (YYYY-MM-DD)'}
          />

        </View>
        {renderErrorMsg(infoError.expirationDateTime)}
      </View>
    );
  }
  function renderMaximumAmount() {
    return (
    <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Driver.Maximum.Discount.Amount')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>

        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Coupon.Placeholder.Maximum.Amount')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            handleNumeric('maxDiscountAvailable', text,)
          }}
          value={selectedCoupon.maxDiscountAvailable ?? ''}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          maxLength={4}
          contentStyle={formStyle.inputPlaceholderLabel}
          keyboardType="numeric"
          inputMode="numeric"

        />

        {renderErrorMsg(infoError.maximumOrderValue)}
      </View>
    );
  }
  return (
    <>
     <ScrollView>
      <View style={[layout.containerPadding]}>
        <Loader loading={loading || saveLoading} />
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
            layout.flexWrap,
          ]}>
          <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.Add.Coupon')}</Typography>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom30]} />
        <View style={layout.cardBox}>
          <View style={styles.headerContainer}>
            <Text style={[layout.accordionTitle, layout.marBottom30]}>
              {TranslateMessage('Admin.Delivery.App.Coupon.CouponManager')}
            </Text>
          </View>
          <View>
            <View style={[formStyle.formRow]}>
              {renderCouponName()}
              {renderCouponValue()}
            </View>
            <View style={[formStyle.formRow]}>
              {renderAmount()}
              {renderMaximumAmount()}
            </View>
            <View style={[formStyle.formRow]}>
              {renderExpixyDate()}
              {renderFrenchName()}
            </View>
          </View>
          {renderErrorMsg(infoError.apiError)}
          <View style={[formStyle.formRow, { justifyContent: 'flex-end' }]}>
            <View style={[formStyle.formCol50, formStyle.formRow,{ justifyContent: 'flex-end' }]}>
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

export default AddTags;
