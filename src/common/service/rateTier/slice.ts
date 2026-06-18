import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRateTier } from 'src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil';
import { IRateTierListResponse } from 'src/components/RateTier/Cities/rateTierList/RateTierListingUtil';

export interface IRateTierListState {
  loading: boolean;
  error: string | null;
  data: IRateTierListResponse;
  page: number;
  vehicleCategory: {
    data: IVehicleCategoryOption[];
    loading: boolean,
    error: string | null
  }
  rateTierDetails:{
    data: IRateTier | null;
    loading: boolean;
    error: string | null;
  },
  rateTierSave: {
    loading: boolean,
    error: string | null,
    success: boolean,
  }
}
export interface IVehicleCategoryOption {
  label: string;
  value: string;
}
const initialRateTierListState: IRateTierListState = {
  loading: false,
  error: null,
  data: { data: [], total: 0, page: 0, size: 0 },
  page: 0,
  vehicleCategory: {
    data: [],
    loading: false,
    error: null,
  },
  rateTierDetails: {
    data: null,
    loading: false,
    error: null,
  },
  rateTierSave: {
    loading: false,
    error: null,
    success: false,
  }
};

const rateTierListSlice = createSlice({
  name: 'rateTier',
  initialState: initialRateTierListState,
  reducers: {
    fetchRateTierListRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRateTierListSuccess(
      state,
      action: PayloadAction<IRateTierListResponse>
    ) {
      state.loading = false;
      state.data = action.payload; 
      state.page = action.payload.page;
      state.error = null;
    },
    fetchRateTierListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setRateTierPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    fetchVehicleCategoryRequest(state) {
      state.vehicleCategory.loading = true;
      state.vehicleCategory.error = null;
    },
    fetchVehicleCategorySuccess(state, action: PayloadAction<string[]>) {
      state.vehicleCategory.loading = false;
      state.vehicleCategory.data = action.payload.map((item) => ({
        label: item,
        value: item,
      }));
    },
    fetchVehicleCategoryFailure(state, action: PayloadAction<string>) {
      state.vehicleCategory.loading = false;
      state.vehicleCategory.error = action.payload;
    },
    fetchRateTierByIdRequest(state) {
      state.rateTierDetails.loading = true;
      state.rateTierDetails.error = null;
    },
    
    fetchRateTierByIdSuccess(state, action: PayloadAction<IRateTier>) {
      state.rateTierDetails.loading = false;
      state.rateTierDetails.data = action.payload;
    },
    
    fetchRateTierByIdFailure(state, action: PayloadAction<string>) {
      state.rateTierDetails.loading = false;
      state.rateTierDetails.error = action.payload;
    },
    saveRateTierRequest(state) {
      state.rateTierSave.loading = true;
      state.rateTierSave.error = null;
      state.rateTierSave.success = false;
    },
    saveRateTierSuccess(state) {
      state.rateTierSave.loading = false;
      state.rateTierSave.success = true;
    },
    saveRateTierFailure(state, action: PayloadAction<string>) {
      state.rateTierSave.loading = false;
      state.rateTierSave.error = action.payload;
    },
    resetRateTierState() {
      return initialRateTierListState;
    },
  },
});

export const {
  fetchRateTierListRequest,
  fetchRateTierListSuccess,
  fetchRateTierListFailure,
  setRateTierPage,
  fetchVehicleCategoryRequest,
  fetchVehicleCategorySuccess,
  fetchVehicleCategoryFailure,
  fetchRateTierByIdRequest,
  fetchRateTierByIdSuccess,
  fetchRateTierByIdFailure,
  saveRateTierRequest,
  saveRateTierSuccess,
  saveRateTierFailure,
  resetRateTierState
} = rateTierListSlice.actions;

export const rateTierListReducer = rateTierListSlice.reducer;
