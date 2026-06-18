import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { clearCustomPlanState, fetchPlanBenefits } from 'src/common/service/business/action';
import { usePlansStyle } from 'src/components/Business/Plans/PlansStyle';
import { BusinessShareMode, CustomPlanBenefitsProps, CustomPlanData, CustomPlanFormState, EMPTY_ERRORS, getInitialCustomPlanFormState, validateCustomPlan } from 'src/components/Business/Plans/PlansUtils';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';


export const CustomPlan: React.FC<CustomPlanBenefitsProps> = ({ onValidate, initialData, isEditMode = false, countryISO = '', currency = '' }) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const plansStyle = usePlansStyle();
  const { theme } = useAppTheme();
  const dispatch: AppDispatch = useDispatch();

  const [formData, setFormData] = useState<CustomPlanFormState>(() => getInitialCustomPlanFormState());
  const [businessShareMode, setBusinessShareMode] = useState<BusinessShareMode>('percentage');
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const { planBenefits } = useSelector((state: RootState) => state.business);
  const { data: benefits, selectedBenefits, loading, error } = planBenefits;
  const labelSpacing = { marginBottom: theme.spacing.xs };
  const {
    planName,
    months,
    riderLimit,
    price,
    extraRideChargePercentage,
    shortRideAmount,
    shortRideShareAmount,
    longRideShareAmount,
    monthlyCharges,
    onboardingFirstTimeCharge,
  } = formData;

  useEffect(() => {
    dispatch(fetchPlanBenefits());
    return (() => {
      dispatch(clearCustomPlanState());
    })
  }, [dispatch]);

  useEffect(() => {
    if (!initialData) {
      setFormData(getInitialCustomPlanFormState());
      setBusinessShareMode('percentage');
      setErrors(EMPTY_ERRORS);
      return;
    }

    setFormData(getInitialCustomPlanFormState(initialData));
    const hasPercentageShare = initialData.extraRideChargePercentage !== undefined && initialData.extraRideChargePercentage !== null;
    const hasRideAmountShare = [
      initialData.shortRideAmount,
      initialData.shortRideShareAmount,
      initialData.longRideShareAmount,
    ].some((value) => value !== undefined && value !== null);
    setBusinessShareMode(hasPercentageShare || !hasRideAmountShare ? 'percentage' : 'rideAmount');
    setErrors(EMPTY_ERRORS);
  }, [initialData]);

  // Create validation function
  const validateForm = useCallback(() => {
    const validation = validateCustomPlan(
      planName,
      months,
      riderLimit,
      selectedBenefits,
      price,
      extraRideChargePercentage,
      shortRideAmount,
      shortRideShareAmount,
      longRideShareAmount,
      monthlyCharges,
      onboardingFirstTimeCharge,
      businessShareMode,
    );

    setErrors(validation.errors);

    if (validation.isValid) {
      const selectedBenefitNames = selectedBenefits
        .filter(b => b.selected)
        .map(b => b.id);

      const data: CustomPlanData = {
        planName: planName.trim(),
        billingCycleMonths: Number(months),
        riderLimit: Number(riderLimit),
        benefitIds: selectedBenefitNames,
        // price: Number(price),
        monthlyCharges: Number(monthlyCharges),
        onboardingFirstTimeCharge: Number(onboardingFirstTimeCharge),
        countryISO,
        currency,
      };

      if (businessShareMode === 'percentage' && extraRideChargePercentage.trim() !== '') {
        data.extraRideChargePercentage = Number(extraRideChargePercentage);
      }

      if (
        businessShareMode === 'rideAmount' &&
        shortRideAmount.trim() !== '' &&
        shortRideShareAmount.trim() !== '' &&
        longRideShareAmount.trim() !== ''
      ) {
        data.shortRideAmount = Number(shortRideAmount);
        data.shortRideShareAmount = Number(shortRideShareAmount);
        data.longRideShareAmount = Number(longRideShareAmount);
      }

      return { isValid: true, data };
    }
    return { isValid: false, data: null };
  }, [
    planName,
    months,
    riderLimit,
    selectedBenefits,
    price,
    extraRideChargePercentage,
    shortRideAmount,
    shortRideShareAmount,
    longRideShareAmount,
    monthlyCharges,
    onboardingFirstTimeCharge,
    businessShareMode,
    countryISO,
    currency,
  ]);

  useEffect(() => {
    if (onValidate) {
      onValidate(validateForm);
    }
  }, [onValidate, validateForm]);

  const updateFormField = <K extends keyof CustomPlanFormState>(field: K, value: CustomPlanFormState[K]) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  };

  const handlePlanNameChange = (text: string) => {
    updateFormField('planName', text);
  };

  const handleMonthsChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    updateFormField('months', numericText);
  };

  const handleNumberOfVehiclesChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    updateFormField('riderLimit', numericText);
  };
  const handleBasePriceChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    updateFormField('price', numericText);
  };

  const handleAmountChange = (field: keyof Pick<CustomPlanFormState, 'monthlyCharges' | 'onboardingFirstTimeCharge'>) => (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');

    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }

    updateFormField(field, numericText);
  };

  const handleRideAmountChange = (field: keyof Pick<CustomPlanFormState, 'shortRideAmount' | 'shortRideShareAmount' | 'longRideShareAmount'>) => (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');

    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }

    updateFormField(field, numericText);
  };

  const handleExtraRideChargePercentageChange = (text: string) => {
    // Allow numbers and decimal point, but ensure it's a valid percentage (0-100)
    const numericText = text.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    const parts = numericText.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    // Check if the value is within 0-100 range
    const value = parseFloat(numericText);
    if (!isNaN(value) && value > 100) {
      return;
    }
    updateFormField('extraRideChargePercentage', numericText);
  };

  const handleBusinessShareModeChange = (mode: BusinessShareMode) => {
    setBusinessShareMode(mode);
    setErrors((currentErrors) => ({
      ...currentErrors,
      extraRideChargePercentage: '',
      shortRideAmount: '',
      shortRideShareAmount: '',
      longRideShareAmount: '',
    }));
  };

  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderPlanNameInput() {
    return (
      <View style={formStyle.width48}>
        <View style={labelSpacing}>
          <Typography>{TranslateMessage('Admin.Delivery.App.Business.PlanName')}<Typography color={theme.colors.textErrorDark}>*</Typography></Typography>
        </View>
        <View>

          {
            isEditMode ?
            <TextInput
              style={[formStyle.inputField, layout.readonlyInput,]}
              value={planName}
              mode='outlined'
              disabled
              autoCapitalize='none'
              activeOutlineColor={theme.colors.borderErrorInverse}
              outlineColor={theme.colors.borderMedium}
              contentStyle={formStyle.inputPlaceholderLabel}
              placeholderTextColor={theme.colors.textNeutral}
              placeholder={TranslateMessage('Admin.Delivery.App.Select.Country')}
            />
            :
            <TextInput
              style={[
                formStyle.inputField,
                errors.planName !== '' && formStyle.errorBorderColor,
              ]}
              value={planName}
              mode="outlined"
              autoCapitalize="none"
              activeOutlineColor={theme.colors.borderErrorInverse}
              outlineColor={theme.colors.borderMedium}
              contentStyle={formStyle.inputPlaceholderLabel}
              placeholderTextColor={theme.colors.textNeutral}
              maxLength={50}
              placeholder={TranslateMessage('Admin.Delivery.App.Business.PlanNamePlaceholder')}
              onChangeText={handlePlanNameChange}
              disabled={isEditMode}
            />
          }
          {renderErrorMsg(errors.planName)}
        </View>
      </View>
    );
  }

  function renderMonthsInput() {
    return (
      <View style={formStyle.width48}>
        <View style={labelSpacing}>
          <Typography >
            {TranslateMessage('Admin.Delivery.App.Business.Months')}
            <Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.months !== '' && formStyle.errorBorderColor,
            ]}
            value={months}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="numeric"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={3}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.MonthsPlaceholder')}
            onChangeText={handleMonthsChange}
          />
          {renderErrorMsg(errors.months)}
        </View>
      </View>
    );
  }
  function renderBasePriceInput() {
    return (
      <View style={formStyle.width48}>
        <View style={labelSpacing}>
          <Typography >{TranslateMessage('Admin.Delivery.App.Business.Base.Price')}<Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.price !== '' && formStyle.errorBorderColor,
            ]}
            value={price}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="numeric"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={4}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.Base.PricePlaceholder')}
            onChangeText={handleBasePriceChange}
          />
          {renderErrorMsg(errors.price)}
        </View>
      </View>
    );
  }
  function renderExtraRideChargePercentageInput(containerStyle: StyleProp<ViewStyle> = formStyle.width48) {
    return (
      <View style={containerStyle}>
        <View style={labelSpacing}>
          <Typography>
            {TranslateMessage('Admin.Delivery.App.Business.ExtraRideChargePercentage')}
            <Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.extraRideChargePercentage !== '' && formStyle.errorBorderColor,
            ]}
            value={extraRideChargePercentage}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="decimal-pad"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={6} // Allow for values like "100.00"
            placeholder={TranslateMessage('Admin.Delivery.App.Business.ExtraRideChargePercentagePlaceholder')}
            onChangeText={handleExtraRideChargePercentageChange}
            right={<TextInput.Affix text="%" />}
          />
          {renderErrorMsg(errors.extraRideChargePercentage)}
        </View>
      </View>
    );
  }

  function getCurrencyAffix() {
    return currency || '';
  }

  function renderCurrencyAdornment() {
    const currencyAffix = getCurrencyAffix();

    if (!currencyAffix) {
      return undefined;
    }

    return (
      <TextInput.Icon
        icon={() => (
          <Typography style={plansStyle.currencyInputAffix}>
            {currencyAffix}
          </Typography>
        )}
        style={plansStyle.currencyInputIcon}
      />
    );
  }

  function renderShortRideAmountInput(containerStyle: StyleProp<ViewStyle> = formStyle.width48) {
    return (
      <View style={containerStyle}>
        <View style={[labelSpacing, layout.driverCardRow]}>
          <Typography>{TranslateMessage('Admin.Delivery.App.Business.ShortRideAmount')}</Typography>
          <Typography color={theme.colors.textErrorDark}>*</Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.shortRideAmount !== '' && formStyle.errorBorderColor,
            ]}
            value={shortRideAmount}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="decimal-pad"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={10}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.ShortRideAmountPlaceholder')}
            onChangeText={handleRideAmountChange('shortRideAmount')}
            left={renderCurrencyAdornment()}
          />
          {renderErrorMsg(errors.shortRideAmount)}
        </View>
      </View>
    );
  }

  function renderShortRideShareAmountInput(containerStyle: StyleProp<ViewStyle> = formStyle.width48) {
    return (
      <View style={containerStyle}>
        <View style={[labelSpacing, layout.driverCardRow]}>
          <Typography>{TranslateMessage('Admin.Delivery.App.Business.ShortRideShareAmount')}</Typography>
          <Typography color={theme.colors.textErrorDark}>*</Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.shortRideShareAmount !== '' && formStyle.errorBorderColor,
            ]}
            value={shortRideShareAmount}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="decimal-pad"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={10}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.ShortRideShareAmountPlaceholder')}
            onChangeText={handleRideAmountChange('shortRideShareAmount')}
            left={renderCurrencyAdornment()}
          />
          {renderErrorMsg(errors.shortRideShareAmount)}
        </View>
      </View>
    );
  }

  function renderLongRideShareAmountInput(containerStyle: StyleProp<ViewStyle> = formStyle.width48) {
    return (
      <View style={containerStyle}>
        <View style={[labelSpacing, layout.driverCardRow]}>
          <Typography>{TranslateMessage('Admin.Delivery.App.Business.LongRideShareAmount')}</Typography>
          <Typography color={theme.colors.textErrorDark}>*</Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.longRideShareAmount !== '' && formStyle.errorBorderColor,
            ]}
            value={longRideShareAmount}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="decimal-pad"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={10}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.LongRideShareAmountPlaceholder')}
            onChangeText={handleRideAmountChange('longRideShareAmount')}
            left={renderCurrencyAdornment()}
          />
          {renderErrorMsg(errors.longRideShareAmount)}
        </View>
      </View>
    );
  }

  function renderRiderLimitInput() {
    return (
      <View style={formStyle.width48}>
        <View style={labelSpacing}>
          <Typography >{TranslateMessage('Admin.Delivery.App.Business.RiderLimit')}<Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.riderLimit !== '' && formStyle.errorBorderColor,
            ]}
            value={riderLimit}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="numeric"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={6}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.RiderLimitPlaceholder')}
            onChangeText={handleNumberOfVehiclesChange}
          />
          {renderErrorMsg(errors.riderLimit)}
        </View>
      </View>
    );
  }

  function renderMonthlyChargesInput() {
    return (
      <View style={formStyle.width48}>
        <View style={labelSpacing}>
          <Typography >{TranslateMessage('Admin.Delivery.App.Business.MonthlyCharges')}<Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.monthlyCharges !== '' && formStyle.errorBorderColor,
            ]}
            value={monthlyCharges}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="decimal-pad"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={10}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.MonthlyChargesPlaceholder')}
            onChangeText={handleAmountChange('monthlyCharges')}
            left={renderCurrencyAdornment()}
          />
          {renderErrorMsg(errors.monthlyCharges)}
        </View>
      </View>
    );
  }

  function renderOnboardingFirstTimeChargeInput() {
    return (
      <View style={formStyle.width48}>
        <View style={labelSpacing}>
          <Typography >{TranslateMessage('Admin.Delivery.App.Business.OnboardingFirstTimeCharge')}<Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View>
          <TextInput
            style={[
              formStyle.inputField,
              errors.onboardingFirstTimeCharge !== '' && formStyle.errorBorderColor,
            ]}
            value={onboardingFirstTimeCharge}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="decimal-pad"
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            contentStyle={formStyle.inputPlaceholderLabel}
            placeholderTextColor={theme.colors.textNeutral}
            maxLength={10}
            placeholder={TranslateMessage('Admin.Delivery.App.Business.OnboardingFirstTimeChargePlaceholder')}
            onChangeText={handleAmountChange('onboardingFirstTimeCharge')}
            left={renderCurrencyAdornment()}
          />
          {renderErrorMsg(errors.onboardingFirstTimeCharge)}
        </View>
      </View>
    );
  }

  function renderPlanShareCard() {
    const renderBusinessShareTab = (mode: BusinessShareMode, label: string) => {
      const isActive = businessShareMode === mode;

      return (
        <Pressable
          onPress={() => handleBusinessShareModeChange(mode)}
          style={[plansStyle.businessShareTab, isActive && plansStyle.businessShareTabActive]}
        >
          <Typography
            style={[plansStyle.businessShareTabText, isActive && plansStyle.businessShareTabTextActive]}
          >
            {label}
          </Typography>
        </Pressable>
      );
    };

    return (
      <View style={plansStyle.planShareWrapper}>
        <View style={plansStyle.planShareLabel}>
          <View style={plansStyle.sectionIcon}>
            <Typography variant='body' fontWeight='semiBold'>3</Typography>
          </View>
          <Typography variant='subTitle' style={plansStyle.sectionTitle}>
            {TranslateMessage('Admin.Delivery.App.Business.BusinessShare')}
            {/* <Typography color={theme.colors.textErrorDark}>*</Typography> */}
          </Typography>
        </View>
        <View style={plansStyle.planShareCard}>
          <View style={plansStyle.businessShareTabContainer}>
            {renderBusinessShareTab(
              'percentage',
              TranslateMessage('Admin.Delivery.App.Business.PercentageShare')
            )}
            {renderBusinessShareTab(
              'rideAmount',
              TranslateMessage('Admin.Delivery.App.Business.RideAmountShare')
            )}
          </View>

          {businessShareMode === 'percentage' ? (
            renderExtraRideChargePercentageInput(plansStyle.fullWidth)
          ) : (
            <View style={plansStyle.rideAmountFields}>
              <View style={[formStyle.formRow, plansStyle.rideAmountRow]}>
                {renderShortRideAmountInput()}
                {renderShortRideShareAmountInput()}
              </View>
              <View style={[formStyle.formRow, plansStyle.rideAmountLastRow]}>
                {renderLongRideShareAmountInput()}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  function renderBenefitsList() {
    if (loading) {
      return (
        <View style={[layout.cardBody, { padding: 20, alignItems: 'center' }]}>
          <Loader />
        </View>
      );
    }

    if (error) {
      return (
        <View style={[layout.cardBody, { padding: 20 }]}>
          <Typography variant='errorMessage'>{error}</Typography>
        </View>
      );
    }

    if (benefits.length === 0) {
      return (
        <View style={[layout.cardBody, { padding: 20 }]}>
          <Typography color={theme.colors.textNeutral}>
            {TranslateMessage('Admin.Delivery.App.Business.NoBenefitsAvailable')}
          </Typography>
        </View>
      );
    }

    return (
      <View style={[layout.cardBody, { padding: 0 }]}>
        <View style={labelSpacing}>
          <Typography >
            {TranslateMessage('Admin.Delivery.App.Business.SelectBenefits')}
            <Typography color={theme.colors.textErrorDark}>*</Typography>
          </Typography>
        </View>
        <View style={{ marginTop: 15 }}>
          {benefits.map((benefit) => {
            return (
              <View
                key={benefit.benefitName}
                style={[
                  formStyle.formRow,
                  {
                    alignItems: 'center',
                    marginBottom: 12,
                    paddingVertical: 8,
                  },
                ]}
              >
                <Pressable disabled>
                  <Icon
                    name='checkboxChecked'
                    color={theme.colors.themeIcon}
                    size={24}
                  />
                </Pressable>

                <Typography style={{ marginLeft: 12, flex: 1 }}>
                  {benefit.description}
                </Typography>
              </View>
            );
          })}
        </View>
        {errors.benefits ? (
          <View style={{ marginTop: theme.spacing.sm }}>
            {renderErrorMsg(errors.benefits)}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={plansStyle.sectionCard}>
      <View>
        <View style={plansStyle.sectionHeader}>
          <View style={plansStyle.sectionTitleWrap}>
            <View style={plansStyle.sectionIcon}>
              <Typography variant='body' fontWeight='semiBold'>2</Typography>
            </View>
            <Typography variant='subTitle' style={plansStyle.sectionTitle}>
              {TranslateMessage('Admin.Delivery.App.Business.PlanConfiguration')}
            </Typography>
          </View>
        </View>
        <View style={formStyle.formBoxLayout}>
          <View style={formStyle.formRow}>
            {renderPlanNameInput()}
            {renderMonthsInput()}
          </View>
          <View style={formStyle.formRow}>
            {/* {renderRiderLimitInput()} */}
            {renderOnboardingFirstTimeChargeInput()}
            {renderMonthlyChargesInput()}
            {/* {renderBasePriceInput()} */}
          </View>
          <View style={formStyle.formRow}>
            {renderPlanShareCard()}
          </View>
          <View style={[formStyle.formRow, { marginTop: 20 }]}>
            {renderBenefitsList()}
          </View>
        </View>
      </View>
    </View>
  );
};
