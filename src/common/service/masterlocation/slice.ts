import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface IDistrict {
  id: number;
  name: string;
  districtCode: string;
}

 interface IDistrictListResponse {
  data: IDistrict[];
  total: number;
  page: number;
  size: number;
}

export interface CityListingState {
  loading: boolean;
  error: string | null;
  data: IDistrictListResponse;
  snackbarVisible: boolean;
}




export interface locationInitialState {
  cityListing: CityListingState;

}

export const locationInitialState: locationInitialState = {
  cityListing: {
    loading: false,
    error: null,
    data: { data: [], total: 0, page: 0, size: 0 },
    snackbarVisible: false,
  },
  
};

const masterLocationSlice = createSlice({
  name: 'masterlocation',
  initialState: locationInitialState,
  reducers: {
    fetchDistrictListing(state) {
      state.cityListing.loading = true;
      state.cityListing.error = null;
    },
    fetchDistrictListingSuccess(state, action: PayloadAction<IDistrictListResponse>) {
      state.cityListing.loading = false;
      state.cityListing.data = action.payload;
    },
    fetchDistrictListingFailure(state, action: PayloadAction<string>) {
      state.cityListing.loading = false;
      state.cityListing.error = action.payload;
    },

    
  },
});

export const {
  fetchDistrictListing,
  fetchDistrictListingSuccess,
  fetchDistrictListingFailure,

} = masterLocationSlice.actions;

export const MasterLocationReducer = masterLocationSlice.reducer;
