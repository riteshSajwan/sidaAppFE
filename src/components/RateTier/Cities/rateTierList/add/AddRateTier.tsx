import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchRateTierByIdAction, fetchVehicleCategoryInitAction, saveRateTierAction } from 'src/common/service/rateTier/action';
import { resetRateTierState } from 'src/common/service/rateTier/slice';
import { DateType, IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { generateInitialErrorsData, generateInitialVehiclePricing, getVehicleCategoryLabel, getVehicleTypeLabel, IRateTier, IRateTierErrors, validateRateTier, VehicleCategory, VehicleType, vehicleTypeOptions } from 'src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';


const AddRateTier = () => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const styles = useRestroStyle();
  const dispatch = useDispatch<AppDispatch>();
  const [infoError, setInfoError] = useState<IRateTierErrors>({
    ...generateInitialErrorsData(),
  });
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [addRateTier, setAddRateTier] = useState<IRateTier>({
    ...generateInitialVehiclePricing(),
  });
  const { id, rateTierId } = useLocalSearchParams<{
    id: string;
    rateTierId: string
  }>();
  const { loading, error, data } = useSelector((state: RootState) => state.rateTier.vehicleCategory);
  const focus = useIsFocused();
  const { loading: saveLoading, error: saveError, success } = useSelector((state: RootState) => state.rateTier.rateTierSave);
  const handleDismiss = () => {
    setSnackbarVisible(false);
    router.push(`${Routes.RATE_TIERS}${Routes.CITIES}/${id}`);
  };
  useEffect(() => {
    dispatch(fetchVehicleCategoryInitAction(id));
  }, [focus, id])

  const { data: rateTierDetails, loading: rateTierDetailsLoading } = useSelector((state: RootState) => state.rateTier.rateTierDetails);
  useEffect(() => {
    if (rateTierId && focus && id) {
      dispatch(fetchRateTierByIdAction(rateTierId));
    } else {
      reset()
    }
  }, [rateTierId, focus, id]);

  useEffect(() => {
    if (rateTierDetails) {
      setAddRateTier(rateTierDetails);
    }
  }, [rateTierDetails]);

  const reset = () => {
    dispatch(resetRateTierState());
    setAddRateTier({ ...generateInitialVehiclePricing() });
    setInfoError({ ...generateInitialErrorsData() });
    setSnackbarVisible(false);
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateRateTier(addRateTier);
    setInfoError(errors);

    if (!isValid) return;

    const payload = {
      ...addRateTier,
      cityId: id,
    };

    dispatch(saveRateTierAction(payload))
      .then(() => setSnackbarVisible(true))
      .catch(() => { });
  };


  const handleChange = (fieldName: string) => (text: string | DateType | null) => {
    setAddRateTier({ ...addRateTier, [fieldName]: text });
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

  function renderBasePrice() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Base.Price')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.Base.Price')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleChange('basePrice')(text.replace(/\s/g, ''))}
          value={addRateTier.basePrice}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        {renderErrorMsg(infoError.basePrice)}
      </View>
    );
  }
  function renderBusinessShare() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.App.Share')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <View style={layout.customStyleField}>  
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.App.Share')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleChange('businessShare')(text.replace(/\s/g, ''))}
          value={addRateTier.businessShare}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={40}
        />
        <Text style={[formStyle.labelTitle, { fontFamily: theme.fontFamily.bold }]}>
          %
        </Text>
        </View>
        {renderErrorMsg(infoError.businessShare)}
      </View>
    );
  }


  function renderPricePerKm() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.Price.Per.Km')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[
            formStyle.inputField]}
          placeholder={TranslateMessage(
            'Admin.Delivery.App.Enter.Price.Per.Km'
          )}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => {
            handleNumeric('pricePerKm', text,)
          }}

          value={addRateTier.pricePerKm}
          mode='outlined'
          autoCapitalize='none'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          secureTextEntry={false}
          contentStyle={formStyle.inputPlaceholderLabel}
        />
        {renderErrorMsg(infoError.pricePerKm)}
      </View>
    );
  }

  function renderCancellationChargesPercentage() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.CancellationCharges')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.CancellationCharges')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleNumeric('cancellationChargesPercentage', text)}
          value={addRateTier.cancellationChargesPercentage}
          mode='outlined'
          autoCapitalize='none'
          keyboardType='decimal-pad'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={6}
          right={<TextInput.Affix text="%" />}
        />
        {renderErrorMsg(infoError.cancellationChargesPercentage)}
      </View>
    );
  }

  function renderWaitingChargePerMinute() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.WaitingChargePerMinute')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.WaitingChargePerMinute')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleNumeric('waitingChargePerMinute', text)}
          value={addRateTier.waitingChargePerMinute}
          mode='outlined'
          autoCapitalize='none'
          keyboardType='decimal-pad'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          contentStyle={formStyle.inputPlaceholderLabel}
        />
        {renderErrorMsg(infoError.waitingChargePerMinute)}
      </View>
    );
  }

  function renderNonChargeableWaitingTime() {
    return (
      <View style={formStyle.formCol}>
        <Text style={[formStyle.labelTitle]}>
          {TranslateMessage('Admin.Delivery.App.NonChargeableWaitingTime')}
          <Text style={formStyle.asteriskTxt}>*</Text>
        </Text>
        <TextInput
          style={[formStyle.inputField]}
          placeholder={TranslateMessage('Admin.Delivery.App.Enter.NonChargeableWaitingTime')}
          placeholderTextColor={theme.colors.textNeutral}
          onChangeText={(text) => handleNumeric('nonChargeableWaitingTime', text.replace(/[^0-9]/g, ''))}
          value={addRateTier.nonChargeableWaitingTime}
          mode='outlined'
          autoCapitalize='none'
          keyboardType='numeric'
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={theme.colors.borderMedium}
          contentStyle={formStyle.inputPlaceholderLabel}
        />
        {renderErrorMsg(infoError.nonChargeableWaitingTime)}
      </View>
    );
  }

  const onVehicleCategoryDropdown = (item: IMinuteOption) => {
    setAddRateTier(prev => ({
      ...prev,
      vehicleCategory: item.label,
    }));
  };
  const onVehicleTypeDropdown = (item: IMinuteOption) => {
    setAddRateTier(prev => ({
      ...prev,
      vehicleType: item.label,
    }));
  };

  function renderVehicleCategories() {
    const vehicleCategoryDropdownData = (data ?? []).map(item => ({
      label: getVehicleCategoryLabel(item.value as VehicleCategory),
      value: item.value,
    }));
    return (
      <View style={layout.flexCol}>
        <View style={layout.flexmarginBottom}>
          <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}>
            {TranslateMessage('Admin.Delivery.App.Vehicle.Category')}
          </Text>
        </View>
  
        <Customdropdown
          disabled={Boolean(rateTierId)}
          data={vehicleCategoryDropdownData} 
          selectedValue={{
            label: getVehicleCategoryLabel(addRateTier.vehicleCategory as VehicleCategory),
            value: addRateTier.vehicleCategory,
          }}
          onChange={(item) =>
            setAddRateTier(prev => ({ ...prev, vehicleCategory: item.value }))
          }
        />
  
        {renderErrorMsg(infoError.vehicleCategory)}
      </View>
    );
  }
  
  
  
  function renderVehicleType() {
    return (
      <View style={layout.flexCol}>
        <View style={layout.flexmarginBottom}>
          <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}> {TranslateMessage('Admin.Delivery.App.Vehicle.Type')}</Text>
        </View>
        <Customdropdown
          disabled={Boolean(rateTierId)}
          data={vehicleTypeOptions}
          selectedValue={{
            label: getVehicleTypeLabel(addRateTier.vehicleType as VehicleType),
            value: addRateTier.vehicleType
          }}
          onChange={(item) =>
            setAddRateTier(prev => ({
              ...prev,
              vehicleType: item.value as VehicleType
            }))
          }
        />

        {renderErrorMsg(infoError.vehicleType)}
      </View>
    );
  }



  return (
    <>
      <ScrollView>
        <View style={[layout.paddinghor17]}>
          <Loader loading={loading || rateTierDetailsLoading || saveLoading} />
          <View
            style={[
              layout.container,
              styles.headerContainer,
              layout.paddingTop26,
              layout.flexWrap,
            ]}>
            <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.AddRateTier')}</Typography>
          </View>
          <Divider style={[layout.DividerSperator, layout.marBottom30]} />
          <View style={layout.cardBox}>
            <View style={styles.headerContainer}>
              <Text style={[layout.accordionTitle, layout.marBottom30]}>
                {TranslateMessage('Admin.Delivery.App.Rate.Tiers.Details')}
              </Text>
            </View>
            <View>
              <View style={[formStyle.formRow]}>
                <View style={formStyle.formCol}>
                  {renderVehicleType()}
                </View>
                <View style={formStyle.formCol}>
                  {renderVehicleCategories()}
                </View>
              </View>
              <View style={[formStyle.formRow]}>
                {renderBasePrice()}
                {renderPricePerKm()}
              </View>
              <View style={[formStyle.formRow]}>
                {renderWaitingChargePerMinute()}
                {renderNonChargeableWaitingTime()}
              </View>
              <View style={[formStyle.formRow]}>
                {renderCancellationChargesPercentage()}
              </View>
            </View>
            {renderErrorMsg(saveError ?? '')}
            <View style={[formStyle.formRow, { justifyContent: 'flex-end' }]}>
              <View style={[formStyle.formCol50, formStyle.formRow, layout.justifyEnd]}>
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

export default AddRateTier;
