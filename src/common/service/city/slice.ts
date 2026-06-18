import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDriverListResponse } from 'src/components/DriverDetailPage/DriverListUtil';
import {
  generateInitialCityData,
  IAddCity,
} from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/add/AddCityUtil';
import {
  IActiveCity,
  IActiveCityListResponse,
} from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/ManageCitiesUtil';

import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';

export interface CityListState {
  loading: boolean;
  error: string | null;
  data: IActiveCityListResponse;
  snackbarVisible: boolean;
}

export interface AllCityListState {
  loading: boolean;
  error: string | null;
  list: IActiveCity[];
}

export interface CountriesState {
  loading: boolean;
  error: string | null;
  list: { label: string; value: string }[];
}

export interface DriverListingState {
  loading: boolean;
  error: string | null;
  data: IDriverListResponse;
}
interface CityDetailsState {
  loading: boolean;
  error: string | null;
  data: IAddCity;
  currencyList: IMinuteOption[];
  snackbarVisible: boolean;
}

export interface CityState {
  cityList: CityListState;
  cityDetails: CityDetailsState;
  allCityList: AllCityListState;
}

export const cityInitialState: CityState = {
  cityList: {
    loading: false,
    error: null,
    data: { data: [], total: 0, page: 0, size: 0 },
    snackbarVisible: false,
  },
  cityDetails: {
    loading: false,
    error: null,
    data: { ...generateInitialCityData() },
    currencyList: [],
    snackbarVisible: false,
  },
  allCityList: {
    loading: false,
    error: null,
    list: [],
  },
};

const citySlice = createSlice({
  name: 'city',
  initialState: cityInitialState,
  reducers: {
    fetchCityListRequest(state) {
      state.cityList.loading = true;
      state.cityList.error = null;
    },
    fetchCityListSuccess(
      state,
      action: PayloadAction<IActiveCityListResponse>,
    ) {
      state.cityList.loading = false;
      state.cityList.data = action.payload;
    },
    fetchCityListFailure(state, action: PayloadAction<string>) {
      state.cityList.loading = false;
      state.cityList.error = action.payload;
    },
    resetCityList(state) {
      state.cityList = cityInitialState.cityList;
    },
    updateCityStatusSuccess(
      state,
      action: PayloadAction<{ id: number; isActive: boolean }>,
    ) {
      state.cityList.loading = false;
      state.cityList.snackbarVisible = true;

      state.cityList.data.data = state.cityList.data.data.map((city) =>
        city.id === action.payload.id
          ? { ...city, activeStatus: action.payload.isActive }
          : city,
      );
    },
    updateCityStatusFailure(state, action: PayloadAction<string>) {
      state.cityList.loading = false;
      state.cityList.error = action.payload;
    },
    resetUpdateCityStatus(state) {
      state.cityList.snackbarVisible = false;
    },
    fetchCityDetailsRequest(state) {
      state.cityDetails.loading = true;
      state.cityDetails.error = null;
    },
    fetchCityDetailsSuccess(state, action: PayloadAction<IAddCity>) {
      state.cityDetails.loading = false;
      state.cityDetails.data = action.payload;
    },
    fetchCityDetailsFailure(state, action: PayloadAction<string>) {
      state.cityDetails.loading = false;
      state.cityDetails.error = action.payload;
    },
    resetCityDetails(state) {
      state.cityDetails = cityInitialState.cityDetails;
    },
    saveCityRequest(state) {
      state.cityDetails.loading = true;
      state.cityDetails.error = null;
    },
    saveCitySuccess(state, action: PayloadAction<boolean>) {
      state.cityDetails.loading = false;
      state.cityDetails.snackbarVisible = action.payload;
    },
    saveCityFailure(state, action: PayloadAction<string>) {
      state.cityDetails.loading = false;
      state.cityDetails.error = action.payload;
    },
    // Cities by Country Actions
    fetchAllCitiesByCountryRequest(state) {
      state.allCityList.loading = true;
      state.allCityList.error = null;
    },
    fetchAllCitiesByCountrySuccess(
      state,
      action: PayloadAction<IActiveCity[]>,
    ) {
      state.allCityList.loading = false;
      state.allCityList.list = action.payload;
      state.allCityList.error = null;
    },
    fetchAllCitiesByCountryFailure(state, action: PayloadAction<string>) {
      state.allCityList.loading = false;
      state.allCityList.error = action.payload;
    },
    resetAllCitiesByCountry(state) {
      state.allCityList = cityInitialState.allCityList;
    },
  },
});

export const {
  fetchCityListRequest,
  fetchCityListSuccess,
  fetchCityListFailure,
  resetCityList,
  updateCityStatusSuccess,
  updateCityStatusFailure,
  resetUpdateCityStatus,
  fetchCityDetailsRequest,
  fetchCityDetailsSuccess,
  fetchCityDetailsFailure,
  resetCityDetails,
  saveCityFailure,
  saveCityRequest,
  saveCitySuccess,
  fetchAllCitiesByCountryRequest,
  fetchAllCitiesByCountrySuccess,
  fetchAllCitiesByCountryFailure,
  resetAllCitiesByCountry,
} = citySlice.actions;

export const CityReducer = citySlice.reducer;
