import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICouponTag } from 'src/components/CouponPage/add/AddCouponUtil';
import { ICouponListResponse } from 'src/components/CouponPage/CouponListUtil';

export interface CouponListingState {
  loading: boolean;
  error: string | null;
  data: ICouponListResponse;
  snackbarVisible: boolean;
}

interface CouponDetailsState {
  loading: boolean;
  error: string | null;
  data: ICouponTag | null;
}
export interface CouponSaveState {
    loading: boolean;
    error: string | null;
    success: boolean;
  }

export interface CouponState {
  couponListing: CouponListingState;
  couponDetails: CouponDetailsState;
  couponSave: CouponSaveState;
}

export const CouponInitialState: CouponState = {
  couponListing: {
    loading: false,
    error: null,
    data: { data: [], total: 0, page: 0, size: 0 },
    snackbarVisible: false,
  },
  couponDetails: {
    loading: false,
    error: null,
    data: null,
  },
  couponSave: {
    loading: false,
    error: null,
    success: false,
  },
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState: CouponInitialState,
  reducers: {
    fetchCouponListingRequest(state) {
      state.couponListing.loading = true;
      state.couponListing.error = null;
    },
    fetchCouponListingSuccess(state, action: PayloadAction<ICouponListResponse>) {
      state.couponListing.loading = false;
      state.couponListing.data = action.payload;
    },
    fetchCouponListingFailure(state, action: PayloadAction<string>) {
      state.couponListing.loading = false;
      state.couponListing.error = action.payload;
    },
    resetCouponListing(state) {
      state.couponListing = CouponInitialState.couponListing;
    },

    fetchCouponDetailsRequest(state) {
      state.couponDetails.loading = true;
      state.couponDetails.error = null;
    },
    fetchCouponDetailsSuccess(state, action: PayloadAction<ICouponTag>) {
      state.couponDetails.loading = false;
      state.couponDetails.data = action.payload;
    },
    fetchCouponDetailsFailure(state, action: PayloadAction<string>) {
      state.couponDetails.loading = false;
      state.couponDetails.error = action.payload;
    },
    resetCouponDetails(state) {
      state.couponDetails = CouponInitialState.couponDetails;
    },

    updateCouponStatusRequest(state) {
      state.couponListing.error = null;
    },
    updateCouponStatusSuccess(state, action: PayloadAction<{ id: number; isActive: boolean }>) {
      state.couponListing.loading = false;
      state.couponListing.snackbarVisible = true;

      state.couponListing.data.data = state.couponListing.data.data.map((coupon) =>
        coupon.id === action.payload.id
          ? { ...coupon, activeStatus: action.payload.isActive }
          : coupon
      );
    },
    updateCouponStatusFailure(state, action: PayloadAction<string>) {
      state.couponListing.loading = false;
      state.couponListing.error = action.payload;
    },

    setCouponSnackbar(state, action: PayloadAction<boolean>) {
      state.couponListing.snackbarVisible = action.payload;
    },
    saveCouponRequest(state) {
        state.couponSave.loading = true;
        state.couponSave.error = null;
        state.couponSave.success = false;
      },
      saveCouponSuccess(state) {
        state.couponSave.loading = false;
        state.couponSave.success = true;
        state.couponListing.snackbarVisible = true;
      },
      saveCouponFailure(state, action: PayloadAction<string>) {
        state.couponSave.loading = false;
        state.couponSave.error = action.payload;
      },
      resetCouponSave(state) {
        state.couponSave = CouponInitialState.couponSave;
      },
  },
});

export const {
  fetchCouponListingRequest,
  fetchCouponListingSuccess,
  fetchCouponListingFailure,
  resetCouponListing,
  fetchCouponDetailsRequest,
  fetchCouponDetailsSuccess,
  fetchCouponDetailsFailure,
  resetCouponDetails,
  updateCouponStatusRequest,
  updateCouponStatusSuccess,
  updateCouponStatusFailure,
  setCouponSnackbar,
  saveCouponRequest,
  saveCouponSuccess,
  saveCouponFailure,
  resetCouponSave
} = couponSlice.actions;

export const CouponReducer = couponSlice.reducer;
