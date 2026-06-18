import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INearbyCabs } from 'src/components/Cabs/CabsUtil';


export interface NearByCabsState {
  loading: boolean;
  error: string | null;
  list: INearbyCabs[];
}


export interface CabState {
    nearByCabsListing: NearByCabsState;
}

export const countryInitialState: CabState = {
    
    nearByCabsListing: {
    loading: false,
    error: null,
    list: [],
  },
};

const cabSlice = createSlice({
  name: 'cab',
  initialState: countryInitialState,
  reducers: {
 
    fetchNearByCabsRequest(state) {
      state.nearByCabsListing.loading = true;
      state.nearByCabsListing.error = null;
    },
    fetchNearByCabsSuccess(state, action: PayloadAction<INearbyCabs[]>) {
      state.nearByCabsListing.loading = false;
      state.nearByCabsListing.list = action.payload
    },
    fetchNearByCabsFailure(state, action: PayloadAction<string>) {
      state.nearByCabsListing.loading = false;
      state.nearByCabsListing.error = action.payload;
    },
  },
});

export const {
    fetchNearByCabsRequest,
    fetchNearByCabsSuccess,
    fetchNearByCabsFailure,
} = cabSlice.actions;

export const CabReducer = cabSlice.reducer;
