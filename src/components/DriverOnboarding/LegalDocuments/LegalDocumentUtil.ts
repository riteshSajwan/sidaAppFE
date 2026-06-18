import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { translateMessage } from 'src/i18n/createTranslation';

// type DateType = Date | undefined;

interface ILegalInfo {
  userId?: string;
  licenseNumber: string;
  vehicleType?: string | null;
  licenseExpiryDate: string | number | null;
  registrationNumber?: string | null;
  insuranceNumber?: string | null;
  backgroundConsent?: boolean;
  riderLicenseId?: string;
  vehicleId?: number | null;
  vehicleCategory: string | null;
  vehicleName?: string | null;
}
interface ILegalUpdatedInfo {
  riderLicenseId: string;
  licenseNumber: string;
  licenseExpiryDate: string | number | null;
  riderRegistrationId: string;
  registrationNumber?: string | null;
  vehicleType?: string | null;
  vehicleInsuranceId: string;
  insuranceNumber?: string | null;
  backgroundConsent: boolean;
  userId: string;
  vehicleId: number | null;
  vehicleCategory: string | null;
  vehicleName?: string | null;
}
export interface ILicenseProof {
  images: IFilesData[];
}

export interface ILegalResponse {
  userId: number;
  riderLicenseId: number;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseActiveStatus: boolean;
  licenseImages: IImageRes[] | null;
  vehicleId: number | null;
  registrationNumber: string | null;
  vehicleType: string | null;
  registrationExpiryDate: string | null;
  registrationActiveStatus: boolean;
  registrationImages: IImageRes[] | null;
  vehicleInsuranceId: number | null;
  insuranceNumber: string | null;
  insuranceExpiryDate: string | null;
  insuranceActiveStatus: boolean;
  insuranceImages: IImageRes[] | null;
  backgroundConsent: boolean;
  vehicleCategory: string | null;
  vehicleName: string | null;
}

export interface IImageRes {
  id: number;
  fileId: number;
  fileType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileUrl: string;
  isPrimary: boolean;
  deleted: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface IRemoveImage {
  userId: number;
  id: number;
  fileId: number;
}

export const getInitialLegalData = (): ILegalInfo => {
  return {
    licenseNumber: '',
    vehicleType: null,
    licenseExpiryDate: '',
    registrationNumber: null,
    insuranceNumber: null,
    vehicleCategory: null,
  };
};
export interface IErrorsMsg {
  imageUplodFieldError: string;
  apiError: string;
}
function generateIntialImagesData(): ILicenseProof {
  return {
    images: [],
  };
}

function generateIntialErrorMsg(): IErrorsMsg {
  return {
    imageUplodFieldError: '',
    apiError: '',
  };
}
interface ILegalInfoErrors {
  licenseNumberError: string;
  vehicleTypeError: string;
  licenseExpiryError: string;
  vehicleRegistrationError: string;
  insuranceNumberError: string;
  apiError: string;
  enrolledOffersError: string;
  vehicleCategoryTypeError: string;
  vehicleNameError: string;
}

function generateLegalIntialErrorMsg(): ILegalInfoErrors {
  return {
    licenseNumberError: '',
    vehicleTypeError: '',
    licenseExpiryError: '',
    vehicleRegistrationError: '',
    insuranceNumberError: '',
    apiError: '',
    enrolledOffersError: '',
    vehicleCategoryTypeError: '',
    vehicleNameError: '',
  };
}
function validateLicenceNumber(num: string) {
  if (num === '') {
    return translateMessage('Admin.Delivery.App.Licence.Required');
  }
  const alphanumericWithDashRegex = /^[a-zA-Z0-9-]*$/;
  if (num && !alphanumericWithDashRegex.test(num)) {
    return translateMessage('Admin.Delivery.App.License.Number.Alphanumeric');
  }
  return '';
}

function validateVehicleName(num: string) {
  if (num === '') {
    return translateMessage('Admin.Delivery.App.Vehicle.Name.Error');
  }
  return '';
}

function validateBackgroundConsent(consent: boolean) {
  if (!consent) {
    return translateMessage('Admin.Delivery.App.Background.Consent');
  }
  return '';
}

function validateLicenceExpiry(expiry: string | null) {
  if (expiry === '' || expiry === null) {
    return translateMessage('Admin.Delivery.App.Licence.Expiry.Required');
  }
  if (expiry) {
    const expiryDate = new Date(expiry);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (expiryDate.getTime() < today.getTime()) {
      return translateMessage('Admin.Delivery.App.Licence.Expired');
    }
    const twentyYearsLater = new Date(today);
    twentyYearsLater.setFullYear(today.getFullYear() + 20);
    if (expiryDate.getTime() > twentyYearsLater.getTime()) {
      return translateMessage('Admin.Delivery.App.Licence.ExpiryTooFar');
    }
  }
  return '';
}

function validateVehicleRegistration(
  vehicleRegistration: string,
  vehicleType?: string,
): string {
  const alphanumericWithDashRegex = /^[a-zA-Z0-9-]*$/;
  if (vehicleRegistration === '') {
    return translateMessage('Admin.Delivery.App.Registration.Required');
  }
  if (vehicleRegistration && !vehicleType) {
    return translateMessage('Admin.Delivery.App.Registration.Vehicle');
  }
  if (
    vehicleRegistration?.trim() === '' &&
    vehicleRegistration !== '' &&
    vehicleType
  ) {
    return translateMessage('Admin.Delivery.App.Registration.Empty');
  }
  if (!alphanumericWithDashRegex.test(vehicleRegistration)) {
    return translateMessage('Admin.Delivery.App.Registration.SpecialCharacter');
  }
  return '';
}

function validateInsuranceNumber(vehicleRegistration: string): string {
  const alphanumericWithDashRegex = /^[a-zA-Z0-9-]*$/;
  if (!alphanumericWithDashRegex.test(vehicleRegistration)) {
    return translateMessage('Admin.Delivery.App.Insurance.SpecialCharacter');
  }
  return '';
}

function validateVehicleType(num: string) {
  if (num === '') {
    return translateMessage('Admin.Delivery.App.Vehicle.Type.Required');
  }
  return '';
}
function validateCategoryType(num: string) {
  if (num === '') {
    return translateMessage(
      'Admin.Delivery.App.Vehicle.Type.Category.Required',
    );
  }
  return '';
}

function validateLicenceData(
  {
    licenseNumber,
    vehicleType,
    licenseExpiryDate,
    registrationNumber,
    insuranceNumber,
    vehicleCategory,
    vehicleName,
  }: ILegalInfo,
  enrolledOffers: boolean,
): ILegalInfoErrors {
  return {
    licenseNumberError: validateLicenceNumber(licenseNumber) || '',
    vehicleTypeError: validateVehicleType(vehicleType ?? '') || '',
    licenseExpiryError: validateLicenceExpiry(String(licenseExpiryDate)) || '',
    vehicleRegistrationError:
      validateVehicleRegistration(
        registrationNumber ?? '',
        vehicleType ?? '',
      ) || '',
    insuranceNumberError: validateInsuranceNumber(insuranceNumber ?? '') || '',
    apiError: '',
    enrolledOffersError: validateBackgroundConsent(enrolledOffers) || '',
    vehicleCategoryTypeError: validateCategoryType(vehicleCategory ?? '') || '',
    vehicleNameError: validateVehicleName(vehicleName ?? '') || '',
  };
}

function isLicenseObjectEmpty(errors: ILegalInfoErrors): boolean {
  return !(
    errors.apiError ||
    errors.enrolledOffersError ||
    errors.licenseNumberError ||
    errors.licenseExpiryError ||
    errors.vehicleRegistrationError ||
    errors.vehicleTypeError ||
    errors.insuranceNumberError ||
    errors.vehicleNameError
  );
}

export {
  generateIntialErrorMsg,
  generateIntialImagesData,
  generateLegalIntialErrorMsg,
  ILegalInfo,
  ILegalInfoErrors,
  ILegalUpdatedInfo,
  isLicenseObjectEmpty,
  validateInsuranceNumber,
  validateLicenceData,
  validateLicenceExpiry
};

