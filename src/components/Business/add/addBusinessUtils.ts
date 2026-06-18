import { getCountryData, TCountryCode } from "countries-list";
import { IFilesData } from "src/common/components/CustomDocumentPicker/CustomDocumentPicker";
import { validatePhoneNumber } from "src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil";
import { MAX_CHECK_LENGTH } from "src/constants";
import { translateMessage } from "src/i18n/createTranslation";

type ValueType = string | undefined | null;
type MediaObjectType = IFilesData | null;
function getMediaDetails(fileMediaObj: MediaObjectType) {
    return fileMediaObj ? [fileMediaObj] : [];
}
function getValue(value: ValueType) {
    return value || '';
}
export interface IAddressSelected {
    country: {
        label: string;
        value: string;
    },
}
export interface IMinuteOption {
    label: string;
    value: string;
}
function checkIfEmpty(data: string | null | undefined) {
    if (!data) {
      return '';
    }
    return data;
  }
  export interface ICountryOption {
    label: string;
    value: string
  }
  function generateBusinessInitiaData(): IAddBusiness {
    return {
      id:'',
      businessAddress:'',
      businessName: '',
      file: null,
      phoneNumber: '',
      businessEmail: '',
      fleetSize: '',
      riderLimit:'',
    }
}

  function generateBusinessInitialErrorsData(): IErrorInfo {
      return {
        file: '',
        apiError: '',
        businessName: '',
        phoneNumber: '',
        businessEmail: '',
        fleetSize: '',
        riderLimit:'',
        businessImage: '',
        businessSplash: '',
        businessAddress:''
      }
  }
  
  function validateBusinessInfo(business: IAddBusiness, callingCode: string) {
    let isValid = true;
    const errors = {
      file: '',
      apiError: '',
      sellerSharePercentage: '',
      businessName: '',
      phoneNumber: '',
      businessEmail: '',
      businessImage: '',
      businessSplash: '',
      fleetSize:'',
      riderLimit:'',
      businessAddress:''
    };

    const callingCodeText = String(getCountryData(callingCode as TCountryCode)?.phone?.[0] ?? '');
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Business name validation
    if (!business.businessName || business.businessName.trim() === '') {
      errors.businessName = translateMessage('Admin.Delivery.App.Name.required');
      isValid = false;
    }
    if (!business.businessAddress || business.businessAddress.trim() === '') {
      errors.businessAddress = translateMessage('Admin.Delivery.App.BusinessAddress.required');
      isValid = false;
    }

    if (business.businessName.length > MAX_CHECK_LENGTH) {
      errors.businessName = translateMessage('Admin.Delivery.App.Character.Exceed');
      isValid = false;
    }
    if (business.businessName.length > MAX_CHECK_LENGTH) {
      errors.businessName = translateMessage('Admin.Delivery.App.Character.Exceed');
      isValid = false;
    }
    // Business phone validation
    const phoneValidationError = validatePhoneNumber({
      callingCode: callingCodeText,
      phoneNumber: business.phoneNumber?.trim() || null,
    });

    if (phoneValidationError) {
      errors.phoneNumber = phoneValidationError;
      isValid = false;
    }

    // Business email validation
    if (!business.businessEmail.trim()) {
      errors.businessEmail = translateMessage('Admin.Delivery.App.Email.required');
      isValid = false;
    } else if (!emailRegex.test(business.businessEmail.trim())) {
      errors.businessEmail = translateMessage('Admin.Delivery.App.Invalid.Email');
      isValid = false;
    }

    // Logo validation
    // if (!business.file) {
    //   errors.file = translateMessage('Admin.Delivery.App.Company.Logo.Required');
    //   isValid = false;
    // }

    // // Business images validation (at least 1 image required)
    // if (!business.businessImage || business.businessImage.length === 0) {
    //   errors.businessImage = translateMessage('Admin.Delivery.App.Company.Logo.Required');
    //   isValid = false;
    // }

    // // Splash images validation (at least 1 image required)
    // if (!business.businessSplash || business.businessSplash.length === 0) {
    //   errors.businessSplash = translateMessage('Admin.Delivery.App.Business.Splash.Required');
    //   isValid = false;
    // }

    return { isValid, errors };
  }

  export interface IErrorInfo {
    file: string;
    apiError: string;
    businessName: string;
    phoneNumber: string;
    businessEmail: string;
    businessImage: string;
    businessSplash: string;
    fleetSize:string,
    riderLimit:string
    businessAddress:string
}
export interface IErrorAddress {
    address: string,
    country: string,
    apiError: string,
    city:string
}

export interface IAddBusiness {
  id:string,
  businessName: string,
  file?: Blob | null,
  phoneNumber: string;
  businessEmail: string;
  fleetSize:string | number,
  riderLimit:string | number,
  businessAddress:string
}
export interface IBusinessType {
  id: number;
  name: string;
}

interface ICountries {
  label: string;
  value: string;
  currency?:string;
  distanceUnit?:string;
  countryISO?:string;
}
interface IAddBusinessResponse {
    tenantId: string,
    message: string
    databaseCreated: boolean,
    tenantConfigCreated: boolean,
    pgcatConfigUpdated: boolean,
    status: string
}

export { checkIfEmpty, getMediaDetails, getValue, ICountries, validateBusinessInfo,generateBusinessInitialErrorsData,generateBusinessInitiaData,IAddBusinessResponse };
