import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IDropdownOption {
  id: number;
  name: string;
}



export interface ICity {
  id: number;
  name: string;
  cityCode: string;
}

export type IStateListResponse = IDropdownOption[];

export type IDistrictListResponse = IDropdownOption[];

export type ITehsilListResponse = IDropdownOption[];

export type ICityListResponse = ICity[];

export interface IStateListingState {
  loading: boolean;
  error: string | null;
  data: IStateListResponse;
}

export interface IDistrictListingState {
  loading: boolean;
  error: string | null;
  data: IDistrictListResponse;
}

export interface ITehsilListingState {
  loading: boolean;
  error: string | null;
  data: ITehsilListResponse;
}

export interface ICityListingState {
  loading: boolean;
  error: string | null;
  data: ICityListResponse;
}

export interface IMasterLocationState {
  stateListing: IStateListingState;
  districtListing: IDistrictListingState;
  tehsilListing: ITehsilListingState;
  cityListing: ICityListingState;
}

const emptyListResponse: never[] = [];

export const masterLocationInitialState: IMasterLocationState = {
  stateListing: { loading: false, error: null, data: emptyListResponse },
  districtListing: { loading: false, error: null, data: emptyListResponse },
  tehsilListing: { loading: false, error: null, data: emptyListResponse },
  cityListing: { loading: false, error: null, data: emptyListResponse },
};

const masterLocationSlice = createSlice({
  name: "masterlocation",
  initialState: masterLocationInitialState,
  reducers: {
    fetchStateListing(state) {
      state.stateListing.loading = true;
      state.stateListing.error = null;
    },
    fetchStateListingSuccess(state, action: PayloadAction<IStateListResponse>) {
      state.stateListing.loading = false;
      state.stateListing.data = action.payload;
    },
    fetchStateListingFailure(state, action: PayloadAction<string>) {
      state.stateListing.loading = false;
      state.stateListing.error = action.payload;
    },
    resetStateListing(state) {
      state.stateListing = masterLocationInitialState.stateListing;
    },

    fetchDistrictListing(state) {
      state.districtListing.loading = true;
      state.districtListing.error = null;
    },
    fetchDistrictListingSuccess(
      state,
      action: PayloadAction<IDistrictListResponse>,
    ) {
      state.districtListing.loading = false;
      state.districtListing.data = action.payload;
    },
    fetchDistrictListingFailure(state, action: PayloadAction<string>) {
      state.districtListing.loading = false;
      state.districtListing.error = action.payload;
    },
    resetDistrictListing(state) {
      state.districtListing = masterLocationInitialState.districtListing;
    },

    fetchTehsilListing(state) {
      state.tehsilListing.loading = true;
      state.tehsilListing.error = null;
    },
    fetchTehsilListingSuccess(
      state,
      action: PayloadAction<ITehsilListResponse>,
    ) {
      state.tehsilListing.loading = false;
      state.tehsilListing.data = action.payload;
    },
    fetchTehsilListingFailure(state, action: PayloadAction<string>) {
      state.tehsilListing.loading = false;
      state.tehsilListing.error = action.payload;
    },
    resetTehsilListing(state) {
      state.tehsilListing = masterLocationInitialState.tehsilListing;
    },

    fetchCityListing(state) {
      state.cityListing.loading = true;
      state.cityListing.error = null;
    },
    fetchCityListingSuccess(state, action: PayloadAction<ICityListResponse>) {
      state.cityListing.loading = false;
      state.cityListing.data = action.payload;
    },
    fetchCityListingFailure(state, action: PayloadAction<string>) {
      state.cityListing.loading = false;
      state.cityListing.error = action.payload;
    },
    resetCityListing(state) {
      state.cityListing = masterLocationInitialState.cityListing;
    },
  },
});

export const {
  fetchStateListing,
  fetchStateListingSuccess,
  fetchStateListingFailure,
  resetStateListing,
  fetchDistrictListing,
  fetchDistrictListingSuccess,
  fetchDistrictListingFailure,
  resetDistrictListing,
  fetchTehsilListing,
  fetchTehsilListingSuccess,
  fetchTehsilListingFailure,
  resetTehsilListing,
  fetchCityListing,
  fetchCityListingSuccess,
  fetchCityListingFailure,
  resetCityListing,
} = masterLocationSlice.actions;

export const MasterLocationReducer = masterLocationSlice.reducer;
