import RestService from 'src/common/service/restService/restService';
import { IAddCity } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/add/AddCityUtil';
import { IActiveCity, IActiveCityListResponse } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/ManageCitiesUtil';
import { AUTH_BASE_URL } from 'src/constants';

const getActiveCityList = async (id: string, searchText:string,page?: number, size?: number): Promise<IActiveCityListResponse> => {
  return RestService.generateHeaders().then((headers) => {
  const queryParams = [
    searchText ? `searchKey=${searchText}` : '',
    `page=${page}`,
    `size=${size}`
  ]
    .filter(Boolean)
    .join('&');
  return RestService.fetch(AUTH_BASE_URL + `/api/order/customer-onboarding/service-area/country/${id}?${queryParams}`, {
    method: 'GET',
    headers,
  }
    );
  });
};

const setActiveCityStatus = async (id: number, status: boolean) => {
    return RestService.generateHeaders().then((headers) => {
      return RestService.fetch(AUTH_BASE_URL + `/api/order/service-area/update-city-manager-is-active?id=${id}&isActive=${status}`, {
    method: 'PUT',
    headers,
   }
    );
  });
};
const getCityListByCountryId = (id: string): Promise<IActiveCity[]> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/customer-onboarding/service-area/getCities/${id}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

const saveCity = async (data:object) => {
  return RestService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  }).then((headers) => {
      return RestService.fetch(AUTH_BASE_URL + `/api/order/service-area/add-edit-city-manager`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
 }
    );
  });
};
const getCityDetails = async (id: string): Promise<IAddCity> => {
   return RestService.generateHeaders().then((headers) => {
      return RestService.fetch(AUTH_BASE_URL + `/api/order/service-area/get-city-manager/${id}`, {
    method: 'GET',
    headers,
  }
    );
  });
};

export { getActiveCityList, getCityDetails, saveCity, setActiveCityStatus,getCityListByCountryId };
