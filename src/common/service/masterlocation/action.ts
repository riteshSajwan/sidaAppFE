import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';
import { getCityListing, getDistrictListing, getStateListing, getTehsilListing } from './api';
import {
  fetchCityListing,
  fetchCityListingFailure,
  fetchCityListingSuccess,
  fetchDistrictListing,
  fetchDistrictListingFailure,
  fetchDistrictListingSuccess,
  fetchStateListing,
  fetchStateListingFailure,
  fetchStateListingSuccess,
  fetchTehsilListing,
  fetchTehsilListingFailure,
  fetchTehsilListingSuccess,
} from './slice';

export const fetchStateListingAction = (): AppThunk => (dispatch) => {
  dispatch(fetchStateListing());
  return getStateListing()
    .then((result) => {
      dispatch(fetchStateListingSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchStateListingFailure(translateMessage('Admin.Sida.App.SomethingWentWrong')));
    });
};

export const fetchDistrictListingAction = (stateId: number): AppThunk => (dispatch) => {
  dispatch(fetchDistrictListing());
  return getDistrictListing(stateId)
    .then((result) => {
      dispatch(fetchDistrictListingSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchDistrictListingFailure(translateMessage('Admin.Sida.App.SomethingWentWrong')));
    });
};

export const fetchTehsilListingAction = (districtId: number): AppThunk => (dispatch) => {
  dispatch(fetchTehsilListing());
  return getTehsilListing(districtId)
    .then((result) => {
      dispatch(fetchTehsilListingSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchTehsilListingFailure(translateMessage('Admin.Sida.App.SomethingWentWrong')));
    });
};

export const fetchCityListingAction = (stateId: number): AppThunk => (dispatch) => {
  dispatch(fetchCityListing());
  return getCityListing(stateId)
    .then((result) => {
      dispatch(fetchCityListingSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchCityListingFailure(translateMessage('Admin.Sida.App.SomethingWentWrong')));
    });
};
