import {
    getAllActiveCountryList,
    getAllCountryDetail,
    getAllCountryList,
    getAllCountryListAddPlan,
    getCountryById,
    getRegisteredCountryList,
    saveCountry,
    setActiveCountryStatus
} from 'src/common/service/country/api';
import {
    fetchActiveCountriesFailure,
    fetchActiveCountriesRequest,
    fetchActiveCountriesSuccess,
    fetchAllCountriesListingFailure,
    fetchAllCountriesListingRequest,
    fetchAllCountriesListingSuccess,
    fetchAllCountryListFailure,
    fetchAllCountryListSuccess,
    fetchCountryDetailsFailure,
    fetchCountryDetailsRequest,
    fetchCountryDetailsSuccess,
    fetchRegisteredCountryListFailure,
    fetchRegisteredCountryListRequest,
    fetchRegisteredCountryListSuccess,
    saveCountryRequest,
    saveCountrySuccess,
    updateCountryStatusFailure,
    updateCountryStatusSuccess
} from 'src/common/service/country/slice';
import {
    APIError,
    IApiErrorResponse,
    setApiError,
} from 'src/common/utils/errors';
import { IAddCountry, ICountries } from 'src/components/ManageServiceAreas/ManageActiveCountries/add/AddCountryUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchRegisteredCountryListAction =
  (searchText: string, page: number, size: number): AppThunk =>
  (dispatch) => {
    dispatch(fetchRegisteredCountryListRequest());
    return getRegisteredCountryList(searchText, page, size)
      .then((result) => {
        dispatch(fetchRegisteredCountryListSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(
          fetchRegisteredCountryListFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
      });
  };

export const setActiveCountryStatusAction =
  (id: number, isActive: boolean): AppThunk =>
  (dispatch) => {
    dispatch(fetchRegisteredCountryListRequest());
    return setActiveCountryStatus(id, isActive)
      .then(() => {
        dispatch(updateCountryStatusSuccess({ id, isActive }));
        return true;
      })
      .catch((error) => {
        const errorresponse = setApiError(error as IApiErrorResponse);
        dispatch(
          updateCountryStatusFailure(
            errorresponse ??
              translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
      });
  };

export const fetchAllCountriesListAction = (): AppThunk => (dispatch) => {
  dispatch(fetchRegisteredCountryListRequest());
  return getAllCountryList()
    .then((result) => {
      dispatch(fetchAllCountryListSuccess(result));
      return true;
    })
    .catch(() => {
      dispatch(
        fetchAllCountryListFailure(
          translateMessage('Admin.Delivery.App.SomethingWentWrong')
        )
      );
    });
};
export const fetchAllCountriesListAddPlanAction = (): AppThunk => (dispatch) => {
  dispatch(fetchRegisteredCountryListRequest());
  return getAllCountryListAddPlan()
    .then((result) => {
      dispatch(fetchAllCountryListSuccess(result));
      return true;
    })
    .catch(() => {
      dispatch(
        fetchAllCountryListFailure(
          translateMessage('Admin.Delivery.App.SomethingWentWrong')
        )
      );
    });
};

export const fetchCountryDetailsAction =
  (id: string): AppThunk<Promise<IAddCountry | undefined>> =>
  (dispatch) => {
    dispatch(fetchCountryDetailsRequest());

    return getCountryById(id)
      .then((result: IAddCountry) => {
        const normalized: IAddCountry = {
          ...result,
          // preserve full timezones array for dropdown options
          timezones: (result.timezones as string[] | undefined)?.length
            ? (result.timezones as string[])
            : result.timezone
            ? [result.timezone]
            : [],
          // selected value comes from timezone field
          primaryTimezone: result.timezone ?? result.primaryTimezone ?? '',
        };
        dispatch(fetchCountryDetailsSuccess(normalized));
        return normalized;
      })
      .catch(() => {
        dispatch(
          fetchCountryDetailsFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
        return undefined;
      });
  };

export const saveCountryAction =
  (data: IAddCountry): AppThunk =>
  (dispatch) => {
    dispatch(saveCountryRequest());

    return saveCountry(data)
      .then(() => {
        dispatch(saveCountrySuccess(true));
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
            'Admin.Delivery.App.SomethingWentWrong'
          );
        }
        dispatch(fetchCountryDetailsFailure(errorMessage));
        return undefined;
      });
  };

  export const fetchAllActiveCountriesAction = (): AppThunk => (dispatch) => {
  dispatch(fetchActiveCountriesRequest());

  return getAllActiveCountryList()
    .then((result:ICountries[]) => {
      dispatch(fetchActiveCountriesSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchActiveCountriesFailure(translateMessage(
            'Admin.Delivery.App.SomethingWentWrong'
          )));
    });
};

export const fetchAllCountriesListingAction = (): AppThunk => (dispatch) => {
  dispatch(fetchAllCountriesListingRequest());

  return getAllCountryDetail()
    .then((result) => {
      dispatch(fetchAllCountriesListingSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(
        fetchAllCountriesListingFailure(
          translateMessage('Admin.Delivery.App.SomethingWentWrong')
        )
      );
    });
};
