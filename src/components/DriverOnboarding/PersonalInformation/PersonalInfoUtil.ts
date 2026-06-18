import { parsePhoneNumber } from 'awesome-phonenumber';
import { ALLOW_NAME_INPUT_SIZE } from 'src/components/DriverOnboarding/constant/index';
import { translateMessage } from 'src/i18n/createTranslation';

export enum PROFILE_OPTION {
  GALLERY = 'GAL',
  CAMERA = 'CAM',
}

const profileOptions = [
  {
    label: translateMessage('Admin.Delivery.App.Upload.From.Gallery'),
    value: PROFILE_OPTION.GALLERY,
  },
  {
    label: translateMessage('Admin.Delivery.App.Take.Photo'),
    value: PROFILE_OPTION.CAMERA,
  },
];

const genderOptions = [
  { label: translateMessage('Admin.Delivery.App.Male.Label'), value: 'male' },
  {
    label: translateMessage('Admin.Delivery.App.Female.Label'),
    value: 'female',
  },
];

function vehicleOptions() {
  return [
    // { label: translateMessage('Admin.Delivery.App.Two.Wheeler'), value: 'twowheeler' },//for now only four wheeler is being used
    {
      label: translateMessage('Admin.Delivery.App.Four.Wheeler'),
      value: 'fourwheeler',
    },
  ];
}

//this will be changed when api is ready from be so using static values
function vehicleOptionsCategory() {
  return [
    { label: 'STANDARD', value: 'STANDARD' },
    { label: 'FULL SIZE', value: 'FULL_SIZE' },
    { label: 'SUV', value: 'SUV' },
  ];
}

const paymentOptions = [
  {
    label: translateMessage('Admin.Delivery.App.Online.Label'),
    value: 'online',
  },
  {
    label: translateMessage('Admin.Delivery.App.Debit.Card.Label'),
    value: 'debit',
  },
  {
    label: translateMessage('Admin.Delivery.App.Credit.Card.Label'),
    value: 'credit',
  },
  {
    label: translateMessage('Admin.Delivery.App.UPI.Payment.Label'),
    value: 'upi',
  },
];

type DateType = Date | undefined;
interface IVehicleOption {
  label: string;
  value: string;
}
interface IEditProfile {
  id?: number;
  firstName: string;
  phoneNumber: string | null;
  dob?: string | number | null;
  email: string;
  address?: string;
  country?: string;
  city?: string;
  emergencyName: string;
  emergencyNumber: string | null;
  relationship: string;
  emergencyAddress?: string;
  callingCode?: string | null;
  emergencycallingCode?: string | null;
  countryCode?: string | null;
  emergencyCountryCode?: string | null;
  profileUrl?: string;
}

interface EmergencyContactDto {
  id?: string;
  fullName: string;
  phoneNumber: string;
  relationship: string | null;
  address: string | null;
  deleted: boolean;
}

interface IRiderRequestDto {
  firstName: string;
  phoneNumber: string;
  email: string;
  address: string | null;
  dob: Date | string | null;
  country: string;
  city: string;
  emergencyContactDto: EmergencyContactDto;
  countryId: string;
}
export const getInitialPersonalData = (): IEditProfile => {
  return {
    firstName: '',
    phoneNumber: null,
    dob: '',
    email: '',
    address: '',
    country: '',
    city: '',
    emergencyName: '',
    emergencyNumber: null,
    relationship: '',
    emergencyAddress: '',
    callingCode: '91',
    emergencycallingCode: '91',
    countryCode: 'IN',
    emergencyCountryCode: 'IN',
    profileUrl: '',
  };
};
interface IEditRequest {
  firstName: string;
  email: string;
  dob?: string | number | null;
  gender?: string;
  address?: string;
  country?: string;
  city?: string;
  emergencyName: string;
  emergencyNumber: string | null;
  relationship: string;
  emergencyAddress?: string;
  callingCode?: string | null;
  phoneNumber?: string | null;
  emergencycallingCode?: string | null;
  countryCode?: string | null;
  emergencyCountryCode?: string | null;
}
export interface IEditProfileErrors {
  firstNameError: string;
  emailError: string;
  apiError: string;
  phoneNumberError: string;
  dobError: string;
  countryError: string;
  cityError: string;
  emergencyNameError: string;
  emergencyNumberError: string;
  profileImageError: string;
}
interface FileMediaObj {
  uri: string;
  blob: Blob;
  fileName: string;
}

type FileObj = {
  uri: string;
  type: string;
  name: string;
};

function validateName(name: string) {
  const specialCharacterRegex = /[^a-zA-Z0-9\s]/; // Matches any special character

  if (name.trim() === '') {
    return translateMessage('Admin.Delivery.App.Name.Required');
  } else if (specialCharacterRegex.test(name)) {
    return translateMessage('Customer.Delivery.App.InvalidName');
  } else if (name.trim().length < 3) {
    return translateMessage('Customer.Delivery.App.Account.Register.Name.Length', { length: '3' });
  }

  return '';
}

function validateEmail(email: string) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;

  if (email && !emailRegex.test(email)) {
    return translateMessage('Customer.Delivery.App.Email.Invalid');
  }
  return '';
}

function validateEmergencyName(name: string) {
  if (name === '') {
    return translateMessage('Admin.Delivery.App.Name.Required');
  }
  if (name.trim() === '') {
    return translateMessage('Admin.Delivery.App.Not.Empty');
  }
  if (name.length > ALLOW_NAME_INPUT_SIZE) {
    return translateMessage('Admin.Delivery.App.Error.Character.Limit.Field', {
      characterLimit: ALLOW_NAME_INPUT_SIZE.toString(),
    });
  }
  const specialCharacterRegex = /[^a-zA-Z0-9\s]/; // Matches any special character

  if (specialCharacterRegex.test(name)) {
    return translateMessage('Admin.Delivery.App.InvalidName');
  }
  return '';
}

function validateCountry(country?: string) {
  if (country === '') {
    return translateMessage('Admin.Delivery.App.Country.Required');
  }
  return '';
}
function validateCity(city?: string) {
  if (city === '') {
    return translateMessage('Admin.Delivery.App.City.Required');
  }
  return '';
}

function validateBirthDate(dob?: string | number | null) {
  if (dob) {
    const dobDate = new Date(dob);
    const today = new Date();
    const ageDiff = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    const isUnderage = ageDiff < 16 || (ageDiff === 16 && monthDiff < 0) || (ageDiff === 16 && monthDiff === 0 && dayDiff < 0);

    if (isUnderage) {
      return translateMessage('Admin.Delivery.App.Valid.Dob.16');
    }
  } else {
    return translateMessage('Admin.Delivery.App.Dob.Required');
  }

  return '';
}

function validateEmailAddress(email: string | null): string {
  if (!email || email.trim() === '') {
    return translateMessage('Admin.Delivery.App.Email.Required');
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return translateMessage('Admin.Delivery.App.InvalidEmail');
  }

  return '';
}

export { validateBirthDate, validateCity, validateCountry, validateEmail, validateEmailAddress, validateEmergencyName, validateName };

function validatePhoneNumber({ callingCode, phoneNumber }: { callingCode: string | null | undefined; phoneNumber: string | null }): string {
  const fullNumber = `+${callingCode}${phoneNumber}`;
  const pn = parsePhoneNumber(fullNumber);
  if (phoneNumber === null || phoneNumber === '') {
    return translateMessage('Admin.Delivery.App.MobileNumber.Required');
  }

  if (!pn.valid) {
    return translateMessage('Admin.Delivery.App.Invalid.Phone.No');
  }

  return '';
}

export { validatePhoneNumber };

function generateEditIntialErrorMsg(): IEditProfileErrors {
  return {
    firstNameError: '',
    emailError: '',
    apiError: '',
    phoneNumberError: '',
    dobError: '',
    countryError: '',
    cityError: '',
    emergencyNameError: '',
    emergencyNumberError: '',
    profileImageError: '',
  };
}
function validateProfileImage(uploadProfileData: string) {
  if (uploadProfileData.length === 0) {
    return translateMessage('Admin.Delivery.App.ProfileImage.Required');
  }
  return '';
}

function validateProfileData({ firstName, phoneNumber, dob, email, country, city, emergencyName, emergencyNumber, callingCode, emergencycallingCode }: IEditRequest, uploadProfileData: string) {
  const normalizedUserNumber = `${callingCode}${phoneNumber}`.replace(/\D/g, '');
  const normalizedEmergencyNumber = `${emergencycallingCode}${emergencyNumber}`.replace(/\D/g, '');
  const sameNumberError = normalizedUserNumber === normalizedEmergencyNumber ? translateMessage('Admin.Delivery.App.Emergency.Contact.SameAsPrimary') : '';
  return {
    firstNameError: validateName(firstName),
    emailError: validateEmailAddress(email),
    apiError: '',
    phoneNumberError: validatePhoneNumber({
      callingCode,
      phoneNumber: phoneNumber ?? null,
    }),
    dobError: validateBirthDate(dob),
    countryError: validateCountry(country),
    cityError: validateCity(city),
    emergencyNameError: validateEmergencyName(emergencyName),
    emergencyNumberError:
      validatePhoneNumber({
        callingCode: emergencycallingCode,
        phoneNumber: emergencyNumber,
      }) || sameNumberError,
    profileImageError: '',
  };
}

type ITypeInputFor = 'user' | 'emergency';

interface IProfileResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  language: string;
  state: string;
  city: string;
  address: string;
  pinCode: string;
  status: string;
  activeStatus: boolean;
  profileUrl: string;
  isSuperAdmin: boolean;
  requireSetPassword: boolean;
  role: Role;
  dob: string;
  gender: string;
  terms: boolean;
  onboardingSubmitted: boolean;
  enrolledOffers: boolean;
  otpVerified: boolean;
  isApproved?: boolean;
  emergencyContactDto?: EmergencyContactDtoRes;
  superAdmin: boolean;
  approvalRequestStatus?: string;
  comment?: string | null;
  rating: number;
  isNotificationEnabled?: boolean;
}

export interface Role {
  id: number;
  name: string;
}
interface EmergencyContactDtoRes {
  id: string;
  fullName: string;
  phoneNumber: string;
  relationship: string;
  address: string;
  deleted: boolean;
}
export interface IProfileImageResponse {
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

enum UserLoginType {
  EMAIL = 'email',
  MOBILE = 'mobile',
}
interface ICity {
  name: string;
  id: number;
}
export {
  DateType,
  FileMediaObj,
  FileObj,
  genderOptions,
  generateEditIntialErrorMsg,
  ICity,
  IEditProfile,
  IProfileResponse,
  IRiderRequestDto,
  ITypeInputFor,
  IVehicleOption,
  paymentOptions,
  profileOptions,
  UserLoginType,
  validateProfileData,
  vehicleOptions,
  vehicleOptionsCategory
};

