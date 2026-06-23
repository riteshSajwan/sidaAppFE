import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { uploadFormResponse } from 'src/components/Upload/Upload/UploadContainerUtils';


export interface IUserDetailsState {
  data:  null;
  loading: boolean;
  error: string | null;
}


const initialUserDetailsState: IUserDetailsState = {
  data: null,
  loading: false,
  error: null,
};
const initialState:any  = {
  uploadReport: initialUserDetailsState,
};

const userSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    fetchMapWithDetails(state) {
      state.userDetails.loading = true;
      state.userDetails.error = null;
    },
    fetchMapWithDetailsSuccess(state, action: PayloadAction<uploadFormResponse>) {
      state.userDetails.loading = false;
      state.userDetails.data = action.payload;
      state.userDetails.error = null;
    },
    fetchMapWithDetailsFailure(state, action: PayloadAction<string>) {
      state.userDetails.loading = false;
      state.userDetails.error = action.payload;
    },
    resetUserDetails(state) {
      state.userDetails = initialUserDetailsState;
    },
   
  },
});

export const UserReducer = userSlice.reducer;
export const {
    fetchMapWithDetails,
    fetchMapWithDetailsSuccess,
    fetchMapWithDetailsFailure,
    resetUserDetails,

} = userSlice.actions;
