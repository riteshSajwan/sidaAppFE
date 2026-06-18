import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRiderMonthlyScheduleResponse } from 'src/common/service/booking/api';
import { IPastRideListData } from 'src/components/Booking/Add/BookingDetailUtil';
import { IBookingListResponse } from 'src/components/Booking/BookingListUtil';
import { IBookingListResponse as INewBookingListResponse } from 'src/components/NewBooking/NewBookingListUtil';

export interface BookingListingState {
  loading: boolean;
  error: string | null;
  data: IBookingListResponse;
}

export interface BookingState {
  bookingListing: BookingListingState;
  newBookingListing: {
    loading: boolean;
    error: string | null;
    data: INewBookingListResponse;
  };
  bookingAssignment: {
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    snackbarVisible: boolean;
    isSuccess: boolean;
  };
  bookingCancellation: {
    loading: boolean;
    error: string | null;
    snackbarVisible: boolean;
    isSuccess: boolean;
  };
  rideCompletion: {
    loading: boolean;
    error: string | null;
    snackbarVisible: boolean;
    isSuccess: boolean;
  };
  rideDetails: {
    data: IPastRideListData | null;
    loading: boolean;
    error: string;
  };
  roundTripDetails: {
    data: IPastRideListData | null;
    loading: boolean;
    error: string;
  };
  riderMonthlySchedule: {
    data: IRiderMonthlyScheduleResponse | null;
    loading: boolean;
    error: string | null;
  };
}

export const bookingInitialState: BookingState = {
  bookingListing: {
    loading: false,
    error: null,
    data: { data: [], total: 0, page: 0, size: 0 },
  },
  newBookingListing: {
    loading: false,
    error: null,
    data: { data: [], total: 0, page: 0, size: 0 },
  },
  bookingAssignment: {
    loading: false,
    error: null,
    successMessage: null,
    snackbarVisible: false,
    isSuccess: false,
  },
  bookingCancellation: {
    loading: false,
    error: null,
    snackbarVisible: false,
    isSuccess: false,
  },
  rideCompletion: {
    loading: false,
    error: null,
    snackbarVisible: false,
    isSuccess: false,
  },
  rideDetails: {
    data: null,
    loading: false,
    error: '',
  },
  roundTripDetails: {
    data: null,
    loading: false,
    error: '',
  },
  riderMonthlySchedule: {
    data: null,
    loading: false,
    error: null,
  },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState: bookingInitialState,
  reducers: {
    fetchBookingListingRequest(state) {
      state.bookingListing.loading = true;
      state.bookingListing.error = null;
    },

    fetchBookingListingSuccess(state, action: PayloadAction<IBookingListResponse>) {
      state.bookingListing.loading = false;
      state.bookingListing.data = action.payload;
    },

    fetchBookingListingFailure(state, action: PayloadAction<string>) {
      state.bookingListing.loading = false;
      state.bookingListing.error = action.payload;
    },

    resetBookingListing(state) {
      state.bookingListing = bookingInitialState.bookingListing;
    },
    fetchNewBookingListingRequest(state) {
      state.newBookingListing.loading = true;
      state.newBookingListing.error = null;
    },

    fetchNewBookingListingSuccess(state, action: PayloadAction<INewBookingListResponse>) {
      state.newBookingListing.loading = false;
      state.newBookingListing.data = action.payload;
    },

    fetchNewBookingListingFailure(state, action: PayloadAction<string>) {
      state.newBookingListing.loading = false;
      state.newBookingListing.error = action.payload;
    },

    resetNewBookingListing(state) {
      state.newBookingListing = bookingInitialState.newBookingListing;
    },
    assignBookingRequest(state) {
      state.bookingAssignment.loading = true;
      state.bookingAssignment.error = null;
      state.bookingAssignment.successMessage = null;
      state.bookingAssignment.isSuccess = false;
    },

    assignBookingSuccess(state, action: PayloadAction<string | undefined>) {
      state.bookingAssignment.loading = false;
      state.bookingAssignment.successMessage = action.payload ?? null;
      state.bookingAssignment.snackbarVisible = true;
      state.bookingAssignment.isSuccess = true;
    },

    assignBookingFailure(state, action: PayloadAction<string>) {
      state.bookingAssignment.loading = false;
      state.bookingAssignment.error = action.payload;
      state.bookingAssignment.successMessage = null;
      state.bookingAssignment.snackbarVisible = true;
      state.bookingAssignment.isSuccess = false;
    },

    setBookingAssignmentSnackbar(state, action: PayloadAction<boolean>) {
      state.bookingAssignment.snackbarVisible = action.payload;
    },
    cancelBookingRequest(state) {
      state.bookingCancellation.loading = true;
      state.bookingCancellation.error = null;
      state.bookingCancellation.isSuccess = false;
    },

    cancelBookingSuccess(state) {
      state.bookingCancellation.loading = false;
      state.bookingCancellation.snackbarVisible = true;
      state.bookingCancellation.isSuccess = true;
    },

    cancelBookingFailure(state, action: PayloadAction<string>) {
      state.bookingCancellation.loading = false;
      state.bookingCancellation.error = action.payload;
      state.bookingCancellation.snackbarVisible = true;
      state.bookingCancellation.isSuccess = false;
    },

    setBookingCancellationSnackbar(state, action: PayloadAction<boolean>) {
      state.bookingCancellation.snackbarVisible = action.payload;
    },
    completeRideRequest(state) {
      state.rideCompletion.loading = true;
      state.rideCompletion.error = null;
      state.rideCompletion.isSuccess = false;
    },
    completeRideSuccess(state) {
      state.rideCompletion.loading = false;
      state.rideCompletion.snackbarVisible = true;
      state.rideCompletion.isSuccess = true;
    },
    completeRideFailure(state, action: PayloadAction<string>) {
      state.rideCompletion.loading = false;
      state.rideCompletion.error = action.payload;
      state.rideCompletion.snackbarVisible = true;
      state.rideCompletion.isSuccess = false;
    },
    setRideCompletionSnackbar(state, action: PayloadAction<boolean>) {
      state.rideCompletion.snackbarVisible = action.payload;
    },
    fetchRideDetailsRequest(state) {
      state.rideDetails.loading = true;
      state.rideDetails.error = '';
    },

    fetchRideDetailsSuccess(state, action: PayloadAction<IPastRideListData>) {
      state.rideDetails.loading = false;
      state.rideDetails.data = action.payload;
      state.rideDetails.error = '';
    },

    fetchRideDetailsFailure(state, action: PayloadAction<string>) {
      state.rideDetails.loading = false;
      state.rideDetails.error = action.payload;
    },

    resetRideDetails(state) {
      state.rideDetails = { data: null, loading: false, error: '' };
    },
    fetchRoundTripDetailsRequest(state) {
      state.roundTripDetails.loading = true;
      state.roundTripDetails.error = '';
    },
    fetchRoundTripDetailsSuccess(state, action: PayloadAction<IPastRideListData>) {
      state.roundTripDetails.loading = false;
      state.roundTripDetails.data = action.payload;
      state.roundTripDetails.error = '';
    },
    fetchRoundTripDetailsFailure(state, action: PayloadAction<string>) {
      state.roundTripDetails.loading = false;
      state.roundTripDetails.error = action.payload;
      state.roundTripDetails.data = null;
    },
    resetRoundTripDetails(state) {
      state.roundTripDetails = { data: null, loading: false, error: '' };
    },
    fetchRiderMonthlyScheduleRequest(state) {
      state.riderMonthlySchedule.loading = true;
      state.riderMonthlySchedule.error = null;
      state.riderMonthlySchedule.data = null;
    },
    fetchRiderMonthlyScheduleSuccess(state, action: PayloadAction<IRiderMonthlyScheduleResponse>) {
      state.riderMonthlySchedule.loading = false;
      state.riderMonthlySchedule.data = action.payload;
      state.riderMonthlySchedule.error = null;
    },
    fetchRiderMonthlyScheduleFailure(state, action: PayloadAction<string>) {
      state.riderMonthlySchedule.loading = false;
      state.riderMonthlySchedule.error = action.payload;
      state.riderMonthlySchedule.data = null;
    },
    resetRiderMonthlySchedule(state) {
      state.riderMonthlySchedule = bookingInitialState.riderMonthlySchedule;
    },
  },
});

export const {
  fetchBookingListingRequest,
  fetchBookingListingSuccess,
  fetchBookingListingFailure,
  resetBookingListing,
  fetchNewBookingListingRequest,
  fetchNewBookingListingSuccess,
  fetchNewBookingListingFailure,
  resetNewBookingListing,
  assignBookingRequest,
  assignBookingSuccess,
  assignBookingFailure,
  setBookingAssignmentSnackbar,
  cancelBookingRequest,
  cancelBookingSuccess,
  cancelBookingFailure,
  setBookingCancellationSnackbar,
  completeRideRequest,
  completeRideSuccess,
  completeRideFailure,
  setRideCompletionSnackbar,
  fetchRideDetailsRequest,
  fetchRideDetailsSuccess,
  fetchRideDetailsFailure,
  resetRideDetails,
  fetchRoundTripDetailsRequest,
  fetchRoundTripDetailsSuccess,
  fetchRoundTripDetailsFailure,
  resetRoundTripDetails,
  fetchRiderMonthlyScheduleRequest,
  fetchRiderMonthlyScheduleSuccess,
  fetchRiderMonthlyScheduleFailure,
  resetRiderMonthlySchedule,
} = bookingSlice.actions;

export const BookingReducer = bookingSlice.reducer;
