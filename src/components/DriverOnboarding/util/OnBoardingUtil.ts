import { TCountryCode } from 'countries-list';

export interface ICityData {
  countryId: number;
  countryName: string;
  cityId: number;
  cityName: string;
}

export interface ICityRequestData {
  countryId: number;
  cityName: string;
}

export interface ICountryData {
  id: number;
  name: string;
  countryCode: string;
  countryFlagId: string;
  distanceUnit: string;
  currencyType: string;
  description: string;
  activeStatus: boolean;
  isServiceable: boolean;
  deleted: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  serviceable: boolean;
}
export interface ICountryDetails {
  name: string;
  countryCode: TCountryCode;
  navigateFrom?: string;
  id: string;
}

// export interface IActiveCity {
//   id: number;
//   cityName: string;
//   countryId: string;
//   countryEmergencyId: string;
//   countryUserId: string;
//   setCountryUserLoginId: string;
//   countryName: string;
//   activeStatus: boolean;
// }
export interface IActiveCity {
  id: number;
  cityName: string;
  radius: string;
  activeStatus: boolean;
}

export interface IActiveCountries {
  id: number;
  countryName: string;
  distanceUnit: string;
  currencyType: string;
  countryISO: string;
  name: string;
  currency: string;
}

export interface IActiveCityListResponse {
  data: IActiveCity[];
  page: number;
  size: number;
  total: number;
}

export interface IApiErrorResponse {
  errors: string[];
  message?: string;
  code?: string;
  details: string[];
}
export interface IApiErrorAuthResponse {
  message: string;
  code?: string;
}
export interface IApiErrorDetailResponse {
  details: string[];
  message?: string;
  code?: string;
  errors?: string[];
}
export interface IFilesData {
  uri: string;
  blob?: Blob;
  fileName: string;
  id?: number;
  fileId?: number;
  userId?: number;
  fileType?: string;
}

export interface ICountries {
  label: string;
  value: string;
  currency?: string;
  distanceUnit?: string;
  countryISO?: string;
}

export interface IAddressSelected {
  country: {
    label: string;
    value: string;
  };
  city: {
    label: string;
    value: string;
  };
}
