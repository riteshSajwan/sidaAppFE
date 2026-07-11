import RestService from "src/common/service/restService/restService";
import { AUTH_BASE_URL } from "src/constants";
import {
  ICityListResponse,
  IDistrictListResponse,
  IStateListResponse,
  ITehsilListResponse,
} from "./slice";

const getStateListing = (): Promise<IStateListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/auth/master/countries/1/states`,
      {
        method: "GET",
        headers,
      },
    );
  });
};

const getDistrictListing = (
  stateId: number,
): Promise<IDistrictListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/auth/master/states/${stateId}/districts`,
      {
        method: "GET",
        headers,
      },
    );
  });
};

const getTehsilListing = (districtId: number): Promise<ITehsilListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/master/districts/${districtId}/tehsils`,
      {
        method: "GET",
        headers,
      },
    );
  });
};

const getCityListing = (stateId: number): Promise<ICityListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/auth/master/states/${stateId}/cities`,
      {
        method: "GET",
        headers,
      },
    );
  });
};

export {
  getCityListing,
  getDistrictListing,
  getStateListing,
  getTehsilListing
};

