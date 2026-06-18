import {
  getActiveCityList,
  getCityDetails,
  getCityListByCountryId,
  saveCity,
  setActiveCityStatus,
} from 'src/common/service/city/api';
import {
  fetchAllCitiesByCountryFailure,
  fetchAllCitiesByCountryRequest,
  fetchAllCitiesByCountrySuccess,
  fetchCityDetailsFailure,
  fetchCityDetailsRequest,
  fetchCityDetailsSuccess,
  fetchCityListFailure,
  fetchCityListRequest,
  fetchCityListSuccess,
  saveCityRequest,
  saveCitySuccess,
  updateCityStatusFailure,
  updateCityStatusSuccess,
} from 'src/common/service/city/slice';
import {
  APIError,
  IApiErrorResponse,
  setApiError,
} from 'src/common/utils/errors';
import { IAddCity } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/add/AddCityUtil';
import { IActiveCity } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/ManageCitiesUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchCityListAction =
  (id: string, searchText: string, page: number, size: number): AppThunk =>
  (dispatch) => {
    dispatch(fetchCityListRequest());
    return getActiveCityList(id, searchText, page, size)
      .then((result) => {
        dispatch(fetchCityListSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(
          fetchCityListFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong'),
          ),
        );
      });
  };

// Reactive action for fetching cities by country ID
export const fetchCitiesByCountryAction =
  (countryId: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchAllCitiesByCountryRequest());
    return getCityListByCountryId(countryId)
      .then((result: IActiveCity[]) => {
        // Filter only active cities
        const activeCities = result.filter((city) => city.activeStatus);
        dispatch(fetchAllCitiesByCountrySuccess(activeCities));
        return activeCities;
      })
      .catch((error) => {
        const errorMessage =
          error?.errors?.[0] ||
          error?.message ||
          translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(fetchAllCitiesByCountryFailure(errorMessage));
      });
  };

export const setActiveCityStatusAction =
  (id: number, isActive: boolean): AppThunk =>
  (dispatch) => {
    dispatch(fetchCityListRequest());
    return setActiveCityStatus(id, isActive)
      .then(() => {
        dispatch(updateCityStatusSuccess({ id, isActive }));
        return true;
      })
      .catch((error) => {
        const errorresponse = setApiError(error as IApiErrorResponse);
        dispatch(
          updateCityStatusFailure(
            errorresponse ??
              translateMessage('Admin.Delivery.App.SomethingWentWrong'),
          ),
        );
      });
  };

export const fetchCityDetailsAction =
  (id: string): AppThunk<Promise<IAddCity | undefined>> =>
  (dispatch) => {
    dispatch(fetchCityDetailsRequest());

    return getCityDetails(id)
      .then((result: IAddCity) => {
        dispatch(fetchCityDetailsSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(
          fetchCityDetailsFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong'),
          ),
        );
        return undefined;
      });
  };

export const saveCityAction =
  (data: IAddCity): AppThunk =>
  (dispatch) => {
    dispatch(saveCityRequest());

    return saveCity(data)
      .then(() => {
        dispatch(saveCitySuccess(true));
        return true;
      })
      .catch((err) => {
        const error = err as APIError;
        let errorMessage = '';

        if (error.errors && Array.isArray(error.errors)) {
          const firstError = error.errors[0];
          errorMessage =
            firstError ||
            translateMessage('Admin.Delivery.App.SomethingWentWrong');
        } else {
          errorMessage = translateMessage(
            'Admin.Delivery.App.SomethingWentWrong',
          );
        }
        dispatch(fetchCityDetailsFailure(errorMessage));
        return undefined;
      });
  };
