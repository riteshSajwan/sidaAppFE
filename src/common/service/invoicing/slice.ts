import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateInvoiceListData, IInvoiceListResponse } from 'src/components/Invoicing/InvoicingListUtil';

export interface InvoicingListingState {
  loading: boolean;
  settleLoading: boolean;
  resendLoading: boolean;
  error: string | null;
  data: IInvoiceListResponse;
  snackbarVisible: boolean;
  snackbarMessage: string | null;
}

export interface InvoicingState {
  invoiceListing: InvoicingListingState;
}

export const invoicingInitialState: InvoicingState = {
  invoiceListing: {
    loading: false,
    settleLoading: false,
    resendLoading: false,
    error: null,
    data: generateInvoiceListData(),
    snackbarVisible: false,
    snackbarMessage: null,
  },
};

const invoicingSlice = createSlice({
  name: 'invoicing',
  initialState: invoicingInitialState,
  reducers: {
    fetchInvoiceListingRequest(state) {
      state.invoiceListing.loading = true;
      state.invoiceListing.error = null;
    },
    fetchInvoiceListingSuccess(state, action: PayloadAction<IInvoiceListResponse>) {
      state.invoiceListing.loading = false;
      state.invoiceListing.data = action.payload;
    },
    fetchInvoiceListingFailure(state, action: PayloadAction<string>) {
      state.invoiceListing.loading = false;
      state.invoiceListing.error = action.payload;
    },
    settleInvoiceRequest(state) {
      state.invoiceListing.settleLoading = true;
      state.invoiceListing.error = null;
      state.invoiceListing.snackbarMessage = null;
    },
    settleInvoiceSuccess(state, action: PayloadAction<string | undefined>) {
      state.invoiceListing.settleLoading = false;
      state.invoiceListing.snackbarVisible = true;
      state.invoiceListing.snackbarMessage = action.payload ?? null;
    },
    settleInvoiceFailure(state, action: PayloadAction<string>) {
      state.invoiceListing.settleLoading = false;
      state.invoiceListing.error = action.payload;
    },
    resendInvoiceRequest(state) {
      state.invoiceListing.resendLoading = true;
      state.invoiceListing.error = null;
      state.invoiceListing.snackbarMessage = null;
    },
    resendInvoiceSuccess(state, action: PayloadAction<string | undefined>) {
      state.invoiceListing.resendLoading = false;
      state.invoiceListing.snackbarVisible = true;
      state.invoiceListing.snackbarMessage = action.payload ?? null;
    },
    resendInvoiceFailure(state, action: PayloadAction<string>) {
      state.invoiceListing.resendLoading = false;
      state.invoiceListing.error = action.payload;
    },
    setInvoiceSnackbar(state, action: PayloadAction<boolean>) {
      state.invoiceListing.snackbarVisible = action.payload;
    },
    resetInvoiceListing(state) {
      state.invoiceListing = invoicingInitialState.invoiceListing;
    },
  },
});

export const {
  fetchInvoiceListingFailure,
  fetchInvoiceListingRequest,
  fetchInvoiceListingSuccess,
  resetInvoiceListing,
  resendInvoiceFailure,
  resendInvoiceRequest,
  resendInvoiceSuccess,
  settleInvoiceFailure,
  settleInvoiceRequest,
  settleInvoiceSuccess,
  setInvoiceSnackbar,
} = invoicingSlice.actions;

export const InvoicingReducer = invoicingSlice.reducer;
