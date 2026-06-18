import { buildQueryParam } from 'src/common/service/ApiUtil';
import RestService from 'src/common/service/restService/restService';
import { IRateTierDetailsResponse } from 'src/components/RateTier/Cities/add/AddRateTierUtil';
import { IRateTierCityListFilter, IRateTierCityListResponse } from 'src/components/RateTier/Cities/RateTierCityListUtil';
import { IRateTier } from 'src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil';
import { IRateTierListResponse } from 'src/components/RateTier/Cities/rateTierList/RateTierListingUtil';
import { AUTH_BASE_URL } from 'src/constants';

const getRateTierCityList = (filter: IRateTierCityListFilter, page?: number, size?: number): Promise<IRateTierCityListResponse> => {
  const queryParams = [
    buildQueryParam('sortField', filter.sortField),
    buildQueryParam('sortOrder', filter.sortOrder),
    buildQueryParam('name', filter.name),
    buildQueryParam('searchKey', filter.searchKey),
    `page=${page}`,
    `size=${size}`
  ]
    .filter(Boolean)
    .join('&');

  return RestService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  }).then(headers => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/service-area/get-all-city-manager-pagination?${queryParams}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};


const getRateTierDetails = (id: string): Promise<IRateTierDetailsResponse> => {
  return RestService.generateHeaders().then(headers => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/delivery/get-fees-tier?feesTierId=${id}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};


const SaveRateTier = (data: IRateTier) => {
  return RestService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  }).then((headers) =>
    RestService.fetch(AUTH_BASE_URL + '/api/order/fees-tier', {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
  );
};

const getRateTierListing = (id:string ,page?: number, size?: number): Promise<IRateTierListResponse> => {
  const queryParams = [`page=${page}`, `size=${size}`]
    .filter(Boolean)
    .join('&');

  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(AUTH_BASE_URL + `/api/order/fees-tier/city-id/${id}?${queryParams}`, {
      method: 'GET',
      headers,
    })
  );
};

const getRateTierById = (id: string) => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(AUTH_BASE_URL + `/api/order/fees-tier/${id}`, {
      method: 'GET',
      headers,
    })
  );
};

const getVehicleCategory = (id: string) => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(
      AUTH_BASE_URL + `/api/order/fees-tier/${id}/FOUR_WHEELER/missing-categories`,
      {
        method: 'GET',
        headers,
      }
    )
  );
};

export { getRateTierById, getRateTierCityList, getRateTierDetails, getRateTierListing, getVehicleCategory, SaveRateTier };
