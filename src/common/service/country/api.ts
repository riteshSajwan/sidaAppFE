import RestService from 'src/common/service/restService/restService';
import { ICountryDetails } from 'src/components/DriverOnboarding/util/OnBoardingUtil';
import { ICountryListResponse } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageActiveCountriesUtil';
import {
  IAddCountry,
  IAllCountry,
  ICountries,
} from 'src/components/ManageServiceAreas/ManageActiveCountries/add/AddCountryUtil';
import { AUTH_BASE_URL } from 'src/constants';
import { ICountryDetail } from './slice';

// this code might be needed later
// const getMasterCountryList = async (searchText: string, page?: number, size?: number): Promise<IMasterCountryListResponse> => {
//   const headers = await RestService.generateHeaders();
//   const queryParams = [
//     searchText ? `countryName=${searchText}` : '',
//     `page=${page}`,
//     `size=${size}`
//   ]
//     .filter(Boolean)
//     .join('&');
//   return RestService.fetch(AUTH_BASE_URL + `/api/auth/country/customer-onboarding/get-countries-with-pagination?${queryParams}`, {
//     method: 'GET',
//     headers,
//   });
// };

const getRegisteredCountryList = async (
  searchText: string,
  page?: number,
  size?: number,
): Promise<ICountryListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const queryParams = [
      searchText ? `searchKey=${searchText}` : '',
      `page=${page}`,
      `size=${size}`,
    ]
      .filter(Boolean)
      .join('&');
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/order/service-area/get-all-country-manager?${queryParams}`,
      {
        method: 'GET',
        headers,
      },
    );
  });
};

const setActiveCountryStatus = async (id: number, status: boolean) => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/order/service-area/update-country-manager-is-active?id=${id}&isActive=${status}`,
      {
        method: 'PUT',
        headers,
      },
    );
  });
};

const saveCountry = async (data: object) => {
  return RestService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  }).then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + `/api/order/service-area/add-edit-country-manager`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      },
    );
  });
};

const getCountryById = async (id: string): Promise<IAddCountry> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + `/api/order/customer-onboarding/country-manager/${id}`,
      {
        method: 'GET',
        headers,
      },
    );
  });
};

const getAllCountryList = async (): Promise<IAllCountry[]> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + `/api/order/service-area/countries`,
      {
        method: 'GET',
        headers,
      },
    );
  });
};
const getAllCountryListAddPlan = async (): Promise<IAllCountry[]> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + `/api/order/service-area/all-countries`,
      {
        method: 'GET',
        headers,
      },
    );
  });
};

const getAllActiveCountryList = (): Promise<ICountries[]> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + '/api/order/service-area/get-all-active-country-manager',
      {
        method: 'GET',
        headers,
      },
    );
  });
};

const getAllPaymentMethod = async () => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + `/api/order/service-area/get-all-payment-methods`,
      {
        method: 'GET',
        headers,
      },
    );
  });
};

const getActiveCountryList = async () => {
  const headers = await RestService.generateHeaders();
  return RestService.fetch(
    AUTH_BASE_URL + '/api/order/service-area/get-all-active-country-manager',
    {
      method: 'GET',
      headers,
    },
  );
};
const getAllCountryDetail = async (): Promise<ICountryDetail[]> => {
  return RestService.fetch(`${AUTH_BASE_URL}/api/order/service-area/get-serviceable`, {
    method: 'GET',
  });
};
export {
  getActiveCountryList, getAllActiveCountryList,
  getAllCountryList,
  getAllPaymentMethod,
  getCountryById,
  getRegisteredCountryList,
  saveCountry,
  setActiveCountryStatus,
  getAllCountryDetail,
  getAllCountryListAddPlan
};

