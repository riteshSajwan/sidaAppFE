import restService from 'src/common/service/restService/restService';
import { IBankDataResponse } from 'src/components/DriverOnboarding/BankDetails/BankDetailsUtil';
import {
  IImageRes,
  ILegalInfo,
  ILegalResponse,
  ILegalUpdatedInfo,
  IRemoveImage,
} from 'src/components/DriverOnboarding/LegalDocuments/LegalDocumentUtil';
import {
  IProfileImageResponse,
  IProfileResponse,
} from 'src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil';
import {
  IActiveCityListResponse,
  ICityData,
  ICityRequestData,
  ICountryData,
  ICountryDetails,
} from 'src/components/DriverOnboarding/util/OnBoardingUtil';
import { AUTH_BASE_URL } from 'src/constants';

const getCountryDetail = async (countryCode: string) => {
  return restService.fetch(
    `${AUTH_BASE_URL}/api/order/service-area/findCountryByName?countryCode=${countryCode}`,
    {
      method: 'GET',
    },
  );
};
const getAllCountryDetail = async (): Promise<ICountryDetails[]> => {
  return restService.fetch(
    `${AUTH_BASE_URL}/api/order/service-area/get-serviceable`,
    {
      method: 'GET',
    },
  );
};

const getActiveCityList = async (
  id: string,
  page?: number,
  size?: number,
): Promise<IActiveCityListResponse> => {
  const headers = await restService.generateHeaders();
  const queryParams = [`page=${page}`, `size=${size}`]
    .filter(Boolean)
    .join('&');

  const response = await restService.fetch(
    AUTH_BASE_URL +
      `/api/order/service-area/rider/country/${id}?${queryParams}`,
    {
      method: 'GET',
      headers,
    },
  );
  try {
    return response;
  } catch (e) {
    throw new Error('Failed to parse response as JSON');
  }
};

const personalInformationData = async (
  data: FormData,
): Promise<IProfileResponse> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/create-rider-profile-by-admin`,
    {
      method: 'POST',
      headers,
      body: data,
    },
  );
};

const legalInformationData = async (
  data: ILegalInfo,
): Promise<ILegalResponse> => {
  const headers = await restService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });
  return restService.fetch(`${AUTH_BASE_URL}/api/delivery/rider/save-legal`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

const legalUpdatedInformationData = async (
  data: ILegalUpdatedInfo,
): Promise<ILegalResponse> => {
  const headers = await restService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });
  return restService.fetch(`${AUTH_BASE_URL}/api/delivery/rider/update-legal`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

const getProfileData = async (id: string): Promise<IProfileResponse> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/profile?userId=${id}`,
    {
      method: 'GET',
      headers,
    },
  );
};

const getLegalData = async (id: string): Promise<ILegalResponse> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/legal?userId=${id}`,
    {
      method: 'GET',
      headers,
    },
  );
};

const uploadProfileImage = async (
  data: FormData,
): Promise<IProfileImageResponse> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/upload-profile-image`,
    {
      method: 'POST',
      headers,
      body: data,
    },
  );
};

const uploadLicenseImage = async (data: FormData): Promise<IImageRes> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/upload-license-image`,
    {
      method: 'POST',
      headers,
      body: data,
    },
  );
};
const uploadInsuranceImage = async (data: FormData): Promise<IImageRes> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/upload-insurance-image`,
    {
      method: 'POST',
      headers,
      body: data,
    },
  );
};
const uploadRegistrationImage = async (data: FormData): Promise<IImageRes> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/upload-registration-image`,
    {
      method: 'POST',
      headers,
      body: data,
    },
  );
};

// const getRegionDetail = async (data:object) => {
//   const headers = {
//     'Content-Type': 'application/json',
//   };

//   return restService.fetch(
//     `${AUTH_BASE_URL}/api/order/service-area/get-serviceable-area-by-coordinates`,
//     {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(data),
//     }
//   );
// };

const removeImage = async (data: IRemoveImage): Promise<boolean> => {
  const headers = await restService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });
  return restService.fetch(`${AUTH_BASE_URL}/api/delivery/rider/delete-image`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(data),
  });
};

const getCountryInfo = async (data: string): Promise<ICountryData> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/order/service-area/getCountryByName?countryName=${data}`,
    {
      method: 'GET',
      headers,
    },
  );
};

const getCityInfo = async (data: ICityRequestData): Promise<ICityData> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/order/service-area/getCityByName?cityName=${data.cityName}&countryId=${data.countryId}`,
    {
      method: 'GET',
      headers,
    },
  );
};

const verifyOtpBankingDetails = async (
  otp: string,
  phoneNumber: string,
): Promise<boolean> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    AUTH_BASE_URL +
      `/api/auth/verify-twilio-otp?phoneNumber=${phoneNumber}&otp=${otp}`,
    {
      method: 'POST',
      headers,
    },
  );
};

const sendOtpBankingDetails = async (): Promise<boolean> => {
  const headers = await restService.generateHeaders();
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/bank/generate-otp`,
    {
      method: 'POST',
      headers,
    },
  );
};

const getRiderBankData = async (id:string): Promise<IBankDataResponse[]> => {
  const headers = await restService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/bank-details-list?userId=${id}`,
    {
      method: 'GET',
      headers,
    },
  );
};

const updateBankData = async (
  data: IBankDataResponse[],
): Promise<IBankDataResponse[]> => {
  const headers = await restService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });
  return restService.fetch(
    `${AUTH_BASE_URL}/api/delivery/rider/add-edit/bank-detail-by-admin`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    },
  );
};

export {
  getActiveCityList,
  getAllCountryDetail,
  getCityInfo,
  getCountryDetail,
  getCountryInfo,
  getLegalData,
  getProfileData,
  getRiderBankData,
  legalInformationData,
  legalUpdatedInformationData,
  personalInformationData,
  removeImage,
  sendOtpBankingDetails,
  updateBankData,
  uploadInsuranceImage,
  uploadLicenseImage,
  uploadProfileImage,
  uploadRegistrationImage,
  verifyOtpBankingDetails
};

