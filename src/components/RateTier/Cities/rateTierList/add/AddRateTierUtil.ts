import { translateMessage } from 'src/i18n/createTranslation';

interface IRateTier {
    id?: string | null;
    cityId: string | null;
    vehicleCategory: string;
    vehicleType: string;
    basePrice: string;      
    pricePerKm: string; 
    businessShare: string;
    cancellationChargesPercentage: string;
    waitingChargePerMinute: string;
    nonChargeableWaitingTime: string;
  }
  

interface IRateTierErrors {
    apiError: string;
    vehicleCategory: string;
    vehicleType: string;
    basePrice: string;
    pricePerKm: string;
    businessShare: string;
    cancellationChargesPercentage: string;
    waitingChargePerMinute: string;
    nonChargeableWaitingTime: string;
}

function generateInitialVehiclePricing(): IRateTier {
    return {
      id: null,
      cityId: null,
      vehicleCategory: '',
      vehicleType: '',
      basePrice: '',
      pricePerKm: '',
      businessShare: '',
      cancellationChargesPercentage: '',
      waitingChargePerMinute: '',
      nonChargeableWaitingTime: '5',
    };
  }
  

function generateInitialErrorsData(): IRateTierErrors {
    return {
        vehicleCategory: '',
        vehicleType: '',
        basePrice: '',
        apiError: '',
        pricePerKm: '',
        businessShare: '',
        cancellationChargesPercentage: '',
        waitingChargePerMinute: '',
        nonChargeableWaitingTime: '',
    }
}

const validateRateTier = (rateTierData: IRateTier) => {
    const percentageRegex = /^(100(\.00?)?|(\d{1,2}(\.\d{1,2})?))$/;
    const errors: IRateTierErrors = {
        apiError: '',
        vehicleCategory: '',
        vehicleType: '',
        basePrice: '',
        pricePerKm: '',
        businessShare: '',
        cancellationChargesPercentage: '',
        waitingChargePerMinute: '',
        nonChargeableWaitingTime: '',
    };
    
    let isValid = true;
    if (!rateTierData.vehicleCategory) {
        errors.vehicleCategory = translateMessage('Admin.Delivery.App.Vehicle.Category.required');
        isValid = false;
    }
    if (!rateTierData.vehicleType) {
        errors.vehicleType = translateMessage('Admin.Delivery.App.Vehicle.Type.required');
        isValid = false;
    }
    if (!rateTierData.basePrice) {
        errors.basePrice = translateMessage('Admin.Delivery.App.Base.Price.required');
        isValid = false;
    }
    if (!rateTierData.pricePerKm) {
        errors.pricePerKm = translateMessage('Admin.Delivery.App.Price.Per.Km.Type.required');
        isValid = false;
    }
    if (!rateTierData.cancellationChargesPercentage) {
        errors.cancellationChargesPercentage = translateMessage('Admin.Delivery.App.CancellationCharges.required');
        isValid = false;
    } else {
        const val = Number(rateTierData.cancellationChargesPercentage);
        if (isNaN(val) || !percentageRegex.test(rateTierData.cancellationChargesPercentage) || val < 0) {
            errors.cancellationChargesPercentage = translateMessage('Admin.Delivery.App.Country.Valid.Percentage');
            isValid = false;
        }
    }
    if (!rateTierData.waitingChargePerMinute) {
        errors.waitingChargePerMinute = translateMessage('Admin.Delivery.App.WaitingChargePerMinute.required');
        isValid = false;
    } else {
        const waitVal = Number(rateTierData.waitingChargePerMinute);
        const pricePerKmVal = Number(rateTierData.pricePerKm);
        if (isNaN(waitVal) || waitVal < 0) {
            errors.waitingChargePerMinute = translateMessage('Admin.Delivery.App.WaitingChargePerMinute.invalid');
            isValid = false;
        } else if (rateTierData.pricePerKm && !isNaN(pricePerKmVal) && waitVal > pricePerKmVal) {
            errors.waitingChargePerMinute = translateMessage('Admin.Delivery.App.WaitingChargePerMinute.exceeds');
            isValid = false;
        }
    }
    if (!rateTierData.nonChargeableWaitingTime) {
        errors.nonChargeableWaitingTime = translateMessage('Admin.Delivery.App.NonChargeableWaitingTime.required');
        isValid = false;
    } else {
        const val = Number(rateTierData.nonChargeableWaitingTime);
        if (isNaN(val) || val < 0 || !Number.isInteger(val)) {
            errors.nonChargeableWaitingTime = translateMessage('Admin.Delivery.App.NonChargeableWaitingTime.invalid');
            isValid = false;
        }
    }

    return { isValid, errors };
};
export enum VehicleType {
    FOUR_WHEELER = 'FOUR_WHEELER',
  }
  
  export const VehicleTypeLabelKeys: Record<VehicleType, string> = {
    [VehicleType.FOUR_WHEELER]: 'Admin.Delivery.App.Four.Wheeler',
  };
  
  export const vehicleTypeOptions = Object.values(VehicleType).map(v => ({
    label: translateMessage(VehicleTypeLabelKeys[v]),
    value: v,
  }));
  
  export function getVehicleTypeLabel(key: VehicleType | undefined): string {
    if (!key) return '';
    return translateMessage(VehicleTypeLabelKeys[key]);
  }
  export enum VehicleCategory {
    SUV = 'SUV',
    STANDARD = 'STANDARD',
    FULL_SIZE = 'FULL_SIZE',
  }
  export const VehicleCategoryLabelKeys: Record<VehicleCategory, string> = {
    [VehicleCategory.SUV]: 'Admin.Delivery.App.Vehicle.Category.SUV',
    [VehicleCategory.STANDARD]: 'Admin.Delivery.App.Vehicle.Category.Standard',
    [VehicleCategory.FULL_SIZE]: 'Admin.Delivery.App.Vehicle.Category.FullSize',
  };
  export const vehicleCategoryOptions = Object.values(VehicleCategory).map(v => ({
    label: translateMessage(VehicleCategoryLabelKeys[v]),
    value: v,
  }));
  export function getVehicleCategoryLabel(key: VehicleCategory | undefined): string {
    if (!key) return '';
    return translateMessage(VehicleCategoryLabelKeys[key]);
  }
  
  

export { generateInitialErrorsData, generateInitialVehiclePricing, IRateTier, IRateTierErrors, validateRateTier };
