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

export interface IMasterDataOption {
  id: number;
  code: string;
  name: string;
  active: boolean;
}

export interface IBuildingSubType extends IMasterDataOption {
  buildingTypeId: number;
  buildingTypeCode: string;
  buildingTypeName: string;
}

export interface IBuildingDataResponse {
  status: number;
  message: string;
  buildingTypes: IMasterDataOption[];
  buildingSubTypes: IBuildingSubType[];
  terrains: IMasterDataOption[];
  locationContexts: IMasterDataOption[];
  error: string | null;
}

export interface IBuildingDataState {
  loading: boolean;
  error: string | null;
  buildingTypes: IMasterDataOption[];
  buildingSubTypes: IBuildingSubType[];
  terrains: IMasterDataOption[];
  locationContexts: IMasterDataOption[];
}

export interface IMasterLocationState {
  stateListing: IStateListingState;
  districtListing: IDistrictListingState;
  tehsilListing: ITehsilListingState;
  cityListing: ICityListingState;
  buildingTypes: IBuildingDataState
}

const emptyListResponse: never[] = [];

export const masterDataInitalState: IMasterLocationState = {
  stateListing: { loading: false, error: null, data: emptyListResponse },
  districtListing: { loading: false, error: null, data: emptyListResponse },
  tehsilListing: { loading: false, error: null, data: emptyListResponse },
  cityListing: { loading: false, error: null, data: emptyListResponse },
  buildingTypes: {
    loading: false,
    error: null,
    buildingTypes: emptyListResponse,
    buildingSubTypes: emptyListResponse,
    terrains: emptyListResponse,
    locationContexts: emptyListResponse,
  },
};

const masterData = createSlice({
  name: "masterData",
  initialState: masterDataInitalState,
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
      state.stateListing = masterDataInitalState.stateListing;
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
      state.districtListing = masterDataInitalState.districtListing;
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
      state.tehsilListing = masterDataInitalState.tehsilListing;
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
      state.cityListing = masterDataInitalState.cityListing;
    },

    fetchBuildingData(state) {
      state.buildingTypes.loading = true;
      state.buildingTypes.error = null;
    },
    fetchBuildingDataSuccess(state, action: PayloadAction<IBuildingDataResponse>) {
      state.buildingTypes.loading = false;
      state.buildingTypes.buildingTypes = action.payload.buildingTypes;
      state.buildingTypes.buildingSubTypes = action.payload.buildingSubTypes;
      state.buildingTypes.terrains = action.payload.terrains;
      state.buildingTypes.locationContexts = action.payload.locationContexts;
    },
    fetchBuildingDataFailure(state, action: PayloadAction<string>) {
      state.buildingTypes.loading = false;
      state.buildingTypes.error = action.payload;
    },
    resetBuildingData(state) {
      state.buildingTypes = masterDataInitalState.buildingTypes;
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
  fetchBuildingData,
  fetchBuildingDataSuccess,
  fetchBuildingDataFailure,
  resetBuildingData,
} = masterData.actions;

export const MasterLocationReducer = masterData.reducer;
