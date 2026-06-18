import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import {
    generateInitialCountryData,
    IAddCountry,
    IAllCountry,
    ICountries,
} from 'src/components/ManageServiceAreas/ManageActiveCountries/add/AddCountryUtil';
import { ICountryListResponse } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageActiveCountriesUtil';

export interface RegisteredCountryListState {
  loading: boolean;
  error: string | null;
  data: ICountryListResponse;
  snackbarVisible: boolean;
}
export interface ActiveCountriesState {
  loading: boolean;
  error: string | null;
  list: { label: string; value: string; id: number }[];
}

export interface AllCountriesState {
  loading: boolean;
  error: string | null;
  list: ICountryDetail[];
}

export interface ICountryDetail {
  id: number;
  name: string;
  distanceUnit: string;
  countryCode: string;
  currencyType: string;
  countryFlagId: number | null;
  activeStatus: boolean;
  deleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  serviceable: boolean;
}

interface CountryDetailsState {
  loading: boolean;
  error: string | null;
  data: IAddCountry;
  allUnregisteredCountrylist: IAllCountry[];
  currencyList: IMinuteOption[];
  snackbarVisible: boolean;
}

export interface CountryState {
  registeredCountryList: RegisteredCountryListState;
  countryDetails: CountryDetailsState;
  activeCountryListing: ActiveCountriesState;
  allCountriesListing: AllCountriesState;
}

export const countryInitialState: CountryState = {
  registeredCountryList: {
    loading: false,
    error: null,
    data: { data: [], total: 0, page: 0, size: 0 },
    snackbarVisible: false,
  },
  countryDetails: {
    loading: false,
    error: null,
    data: { ...generateInitialCountryData() },
    currencyList: [],
    allUnregisteredCountrylist: [],
    snackbarVisible: false,
  },
  activeCountryListing: {
    loading: false,
    error: null,
    list: [],
  },
  allCountriesListing: {
    loading: false,
    error: null,
    list: [],
  },
};

const countrySlice = createSlice({
  name: 'country',
  initialState: countryInitialState,
  reducers: {
    fetchRegisteredCountryListRequest(state) {
      state.registeredCountryList.loading = true;
      state.registeredCountryList.error = null;
    },
    fetchRegisteredCountryListSuccess(
      state,
      action: PayloadAction<ICountryListResponse>,
    ) {
      state.registeredCountryList.loading = false;
      state.registeredCountryList.data = action.payload;
    },
    fetchRegisteredCountryListFailure(state, action: PayloadAction<string>) {
      state.registeredCountryList.loading = false;
      state.registeredCountryList.error = action.payload;
    },
    resetRegisteredCountryList(state) {
      state.registeredCountryList = countryInitialState.registeredCountryList;
    },
    updateCountryStatusSuccess(
      state,
      action: PayloadAction<{ id: number; isActive: boolean }>,
    ) {
      state.registeredCountryList.loading = false;
      state.registeredCountryList.snackbarVisible = true;

      state.registeredCountryList.data.data =
        state.registeredCountryList.data.data.map((country) =>
          country.id === action.payload.id
            ? { ...country, activeStatus: action.payload.isActive }
            : country,
        );
    },
    updateCountryStatusFailure(state, action: PayloadAction<string>) {
      state.registeredCountryList.loading = false;
      state.registeredCountryList.error = action.payload;
    },
    resetUpdateCountryStatus(state) {
      state.registeredCountryList.snackbarVisible = false;
    },
    fetchCountryDetailsRequest(state) {
      state.countryDetails.loading = true;
      state.countryDetails.error = null;
    },
    fetchCountryDetailsSuccess(state, action: PayloadAction<IAddCountry>) {
      state.countryDetails.loading = false;
      state.countryDetails.data = action.payload;
    },
    fetchCountryDetailsFailure(state, action: PayloadAction<string>) {
      state.countryDetails.loading = false;
      state.countryDetails.error = action.payload;
    },
    resetCountryDetails(state) {
      state.countryDetails = countryInitialState.countryDetails;
    },
    fetchAllCountryListRequest(state) {
      state.countryDetails.loading = true;
      state.countryDetails.error = null;
    },
    fetchAllCountryListSuccess(state, action: PayloadAction<IAllCountry[]>) {
      state.countryDetails.loading = false;
      state.countryDetails.allUnregisteredCountrylist = action.payload;
    },
    fetchAllCountryListFailure(state, action: PayloadAction<string>) {
      state.countryDetails.loading = false;
      state.countryDetails.error = action.payload;
    },
    saveCountryRequest(state) {
      state.countryDetails.loading = true;
      state.countryDetails.error = null;
    },
    saveCountrySuccess(state, action: PayloadAction<boolean>) {
      state.countryDetails.loading = false;
      state.countryDetails.snackbarVisible = action.payload;
    },
    saveCountryFailure(state, action: PayloadAction<string>) {
      state.countryDetails.loading = false;
      state.countryDetails.error = action.payload;
    },
    fetchActiveCountriesRequest(state) {
      state.activeCountryListing.loading = true;
      state.activeCountryListing.error = null;
    },
    fetchActiveCountriesSuccess(state, action: PayloadAction<ICountries[]>) {
      state.activeCountryListing.loading = false;
      state.activeCountryListing.list = [
        { label: 'All', value: '', id: 0 },
        ...action.payload.map((item) => ({
          label: item.countryName,
          value: item.countryName,
          id: item.id,
        })),
      ];
    },
    fetchActiveCountriesFailure(state, action: PayloadAction<string>) {
      state.activeCountryListing.loading = false;
      state.activeCountryListing.error = action.payload;
    },
    fetchAllCountriesListingRequest(state) {
      state.allCountriesListing.loading = true;
      state.allCountriesListing.error = null;
    },
    fetchAllCountriesListingSuccess(state, action: PayloadAction<ICountryDetail[]>) {
      state.allCountriesListing.loading = false;
      state.allCountriesListing.list = action.payload;
    },
    fetchAllCountriesListingFailure(state, action: PayloadAction<string>) {
      state.allCountriesListing.loading = false;
      state.allCountriesListing.error = action.payload;
    },
  },
});

export const {
  fetchRegisteredCountryListRequest,
  fetchRegisteredCountryListSuccess,
  fetchRegisteredCountryListFailure,
  resetRegisteredCountryList,
  updateCountryStatusSuccess,
  updateCountryStatusFailure,
  resetUpdateCountryStatus,
  fetchCountryDetailsRequest,
  fetchCountryDetailsSuccess,
  fetchCountryDetailsFailure,
  resetCountryDetails,
  fetchAllCountryListFailure,
  fetchAllCountryListRequest,
  fetchAllCountryListSuccess,
  saveCountryFailure,
  saveCountryRequest,
  saveCountrySuccess,
  fetchActiveCountriesRequest,
  fetchActiveCountriesSuccess,
  fetchActiveCountriesFailure,
  fetchAllCountriesListingRequest,
  fetchAllCountriesListingSuccess,
  fetchAllCountriesListingFailure,
} = countrySlice.actions;

export const CountryReducer = countrySlice.reducer;
