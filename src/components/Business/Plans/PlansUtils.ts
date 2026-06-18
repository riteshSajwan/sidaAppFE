import { translateMessage } from "src/i18n/createTranslation";

export enum PlanType {
  FIXED = 'FIXED',
  CUSTOM = 'CUSTOM',
}

export enum PlanName {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum BenefitName {
  EMAIL_SUPPORT = 'EMAIL_SUPPORT',
  UP_TO_50_VEHICLES = 'UP_TO_50_VEHICLES',
  PAYMENT_INTEGRATION = 'PAYMENT_INTEGRATION',
  DRIVER_AND_CUSTOMER_APPS = 'DRIVER_AND_CUSTOMER_APPS',
  PHONE_SUPPORT = 'PHONE_SUPPORT',
}

export interface CustomPlanData {
  planName: string;
  billingCycleMonths: number;
  riderLimit: number;
  // price: number;
  extraRideChargePercentage?: number;
  shortRideAmount?: number;
  shortRideShareAmount?: number;
  longRideShareAmount?: number;
  monthlyCharges: number;
  onboardingFirstTimeCharge: number;
  countryName?: string;
  countryISO?: string;
  currency?: string;
  billingCycle?: string;
  benefitIds: number[];
}

export interface CustomPlanValidationErrors {
  planName: string;
  months: string;
  riderLimit: string;
  benefits: string;
  price: string;
  extraRideChargePercentage: string;
  shortRideAmount: string;
  shortRideShareAmount: string;
  longRideShareAmount: string;
  monthlyCharges: string;
  onboardingFirstTimeCharge: string;
}

export type BusinessShareMode = 'percentage' | 'rideAmount';

export const formatBenefitName = (benefitName: string): string => {
  return benefitName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const getPlanByName = (plans: any[], planName: PlanName) => {
  return plans.find(p => p.planName.toUpperCase() === planName);
};

export const validateCustomPlan = (
  planName: string,
  months: string,
  riderLimit: string,
  selectedBenefits: any[],
  price: string,
  extraRideChargePercentage: string,
  shortRideAmount: string,
  shortRideShareAmount: string,
  longRideShareAmount: string,
  monthlyCharges: string,
  onboardingFirstTimeCharge: string,
  businessShareMode: BusinessShareMode = 'percentage'
): { isValid: boolean; errors: CustomPlanValidationErrors } => {
  let isValid = true;
  const errors: CustomPlanValidationErrors = {
    planName: '',
    months: '',
    riderLimit: '',
    benefits: '',
    price: '',
    extraRideChargePercentage: '',
    shortRideAmount: '',
    shortRideShareAmount: '',
    longRideShareAmount: '',
    monthlyCharges: '',
    onboardingFirstTimeCharge: '',
  };

  // Plan name validation
  if (!planName || planName.trim() === '') {
    errors.planName = translateMessage('Admin.Delivery.App.Business.PlanNameRequired');
    isValid = false;
  } else if (planName.length > 50) {
    errors.planName = translateMessage('Admin.Delivery.App.Character.Exceed');
    isValid = false;
  }

  // Months validation
  if (!months || months.trim() === '') {
    errors.months = translateMessage('Admin.Delivery.App.Business.MonthsRequired');
    isValid = false;
  } else if (isNaN(Number(months)) || Number(months) <= 0) {
    errors.months = translateMessage('Admin.Delivery.App.Business.MonthsInvalid');
    isValid = false;
  } else if (Number(months) > 999) {
    errors.months = translateMessage('Admin.Delivery.App.Business.MonthsMaxExceeded');
    isValid = false;
  }
  
  // Price validation
  // if (!price || price.trim() === '') {
  //   errors.price = translateMessage('Admin.Delivery.App.Business.Base.PriceRequired');
  //   isValid = false;
  // } else if (isNaN(Number(price)) || Number(price) <= 0) {
  //   errors.price = translateMessage('Admin.Delivery.App.Business.BasePriceInvalid');
  //   isValid = false;
  // } 
  // if (!riderLimit || riderLimit.trim() === '') {
  //   errors.riderLimit = translateMessage('Admin.Delivery.App.Business.RiderLimit.Required');
  //   isValid = false;
  // } else if (isNaN(Number(riderLimit)) || Number(riderLimit) <= 0) {
  //   errors.riderLimit = translateMessage('Admin.Delivery.App.Business.RiderLimitInvalid');
  //   isValid = false;
  // } 

  const hasPercentage = businessShareMode === 'percentage' && extraRideChargePercentage.trim() !== '';
  const rideAmountFields = [
    shortRideAmount,
    shortRideShareAmount,
    longRideShareAmount,
  ];
  const hasAnyRideAmount = businessShareMode === 'rideAmount' && rideAmountFields.some((value) => value.trim() !== '');
  const hasAllRideAmounts = businessShareMode === 'rideAmount' && rideAmountFields.every((value) => value.trim() !== '');

  // Plan share validation: either percentage or complete short/long ride amount details.
  if (businessShareMode === 'percentage' && !hasPercentage) {
    errors.extraRideChargePercentage = translateMessage('Admin.Delivery.App.Business.ExtraRideChargeRequired');
    isValid = false;
  }

  if (businessShareMode === 'rideAmount' && !hasAllRideAmounts) {
    const requiredMessage = translateMessage('Admin.Delivery.App.Business.PlanShareRequired');
    errors.shortRideAmount = requiredMessage;
    errors.shortRideShareAmount = requiredMessage;
    errors.longRideShareAmount = requiredMessage;
    isValid = false;
  }

  if (hasPercentage && isNaN(Number(extraRideChargePercentage))) {
    errors.extraRideChargePercentage = translateMessage('Admin.Delivery.App.Business.ExtraRideChargeInvalid');
    isValid = false;
  } else if (hasPercentage) {
    const percentage = Number(extraRideChargePercentage);
    if (percentage < 0 || percentage > 100) {
      errors.extraRideChargePercentage = translateMessage('Admin.Delivery.App.Business.ExtraRideChargeRange');
      isValid = false;
    }
  }

  const validateAmount = (value: string, fieldName: keyof Pick<CustomPlanValidationErrors, 'shortRideAmount' | 'shortRideShareAmount' | 'longRideShareAmount'>) => {
    if (value.trim() === '') {
      errors[fieldName] = translateMessage('Admin.Delivery.App.Business.RideAmountRequired');
      isValid = false;
      return;
    }

    if (isNaN(Number(value)) || Number(value) < 0) {
      errors[fieldName] = translateMessage('Admin.Delivery.App.Business.RideAmountInvalid');
      isValid = false;
    }
  };

  if (hasAnyRideAmount || !hasPercentage) {
    validateAmount(shortRideAmount, 'shortRideAmount');
    validateAmount(shortRideShareAmount, 'shortRideShareAmount');
    validateAmount(longRideShareAmount, 'longRideShareAmount');

    if (
      shortRideAmount.trim() !== '' &&
      shortRideShareAmount.trim() !== '' &&
      Number(shortRideShareAmount) > Number(shortRideAmount)
    ) {
      errors.shortRideShareAmount = translateMessage('Admin.Delivery.App.Business.RideShareAmountRange');
      isValid = false;
    }

  }

  if (!monthlyCharges || monthlyCharges.trim() === '') {
    errors.monthlyCharges = translateMessage('Admin.Delivery.App.Business.MonthlyChargesRequired');
    isValid = false;
  } else if (isNaN(Number(monthlyCharges)) || Number(monthlyCharges) < 0) {
    errors.monthlyCharges = translateMessage('Admin.Delivery.App.Business.MonthlyChargesInvalid');
    isValid = false;
  }

  if (!onboardingFirstTimeCharge || onboardingFirstTimeCharge.trim() === '') {
    errors.onboardingFirstTimeCharge = translateMessage('Admin.Delivery.App.Business.OnboardingFirstTimeChargeRequired');
    isValid = false;
  } else if (isNaN(Number(onboardingFirstTimeCharge)) || Number(onboardingFirstTimeCharge) < 0) {
    errors.onboardingFirstTimeCharge = translateMessage('Admin.Delivery.App.Business.OnboardingFirstTimeChargeInvalid');
    isValid = false;
  }

  // Benefits validation
  // const selectedCount = selectedBenefits.filter(b => b.selected).length;
  // if (selectedCount === 0) {
  //   errors.benefits = translateMessage('Admin.Delivery.App.Business.SelectAtLeastOneBenefit');
  //   isValid = false;
  // }

  return { isValid, errors };
};
export interface ICustomPlanResponseDto {
  planId: string;
  planName: string;
  planType: PlanType;
  price: number;
  riderLimit: number;
  monthlyCharges?: number;
  onboardingFirstTimeCharge?: number;
  extraRideChargePercentage?: number;
  shortRideAmount?: number;
  shortRideShareAmount?: number;
  longRideShareAmount?: number;
  countryName?: string;
  countryISO?: string;
  currency?: string;
}

export interface CustomPlanInitialData extends Partial<CustomPlanData> {
  price?: number;
}

export interface CustomPlanBenefitsProps {
  onValidationChange?: (isValid: boolean, data: CustomPlanData | null) => void;
  onValidate?: (validateFn: () => { isValid: boolean; data: CustomPlanData | null }) => void;
  initialData?: CustomPlanInitialData | null;
  isEditMode?: boolean;
  countryISO?: string;
  currency?: string;
}

export interface CustomPlanFormState {
  planName: string;
  months: string;
  riderLimit: string;
  price: string;
  extraRideChargePercentage: string;
  shortRideAmount: string;
  shortRideShareAmount: string;
  longRideShareAmount: string;
  monthlyCharges: string;
  onboardingFirstTimeCharge: string;
}

export const EMPTY_ERRORS = {
  planName: '',
  months: '',
  riderLimit: '',
  benefits: '',
  price: '',
  extraRideChargePercentage: '',
  shortRideAmount: '',
  shortRideShareAmount: '',
  longRideShareAmount: '',
  monthlyCharges: '',
  onboardingFirstTimeCharge: '',
};

const getInitialFormValue = (value?: string | number | null, fallback = '') => {
  return value?.toString() ?? fallback;
};

export const getInitialCustomPlanFormState = (initialData?: CustomPlanInitialData | null): CustomPlanFormState => ({
  planName: getInitialFormValue(initialData?.planName),
  months: getInitialFormValue(initialData?.billingCycleMonths),
  riderLimit: getInitialFormValue(initialData?.riderLimit, initialData ? '0' : ''),
  price: getInitialFormValue(initialData?.price),
  extraRideChargePercentage: getInitialFormValue(initialData?.extraRideChargePercentage),
  shortRideAmount: getInitialFormValue(initialData?.shortRideAmount),
  shortRideShareAmount: getInitialFormValue(initialData?.shortRideShareAmount),
  longRideShareAmount: getInitialFormValue(initialData?.longRideShareAmount),
  monthlyCharges: getInitialFormValue(initialData?.monthlyCharges),
  onboardingFirstTimeCharge: getInitialFormValue(initialData?.onboardingFirstTimeCharge),
});