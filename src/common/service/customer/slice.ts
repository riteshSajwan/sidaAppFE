import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICustomer } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import {  IUserListResponse } from 'src/components/CustomerDetailPage/CustomerListUtil';


export interface CustomerListingState {
    loading: boolean;
    error: string | null;
    data: IUserListResponse;
}
interface CustomerDetailsState {
    loading: boolean;
    error: string | null;
    data: ICustomer | null;
    blockStatus:  boolean | null;
}

export interface CustomerState {
    customerListing: CustomerListingState;
    customerDetails: CustomerDetailsState
}

export const CustomerInitialState: CustomerState = {
    customerListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
    },
    customerDetails: {
        loading: false,
        error: null,
        data: null,
        blockStatus: null, 
    }
};

const customerSlice = createSlice({
    name: 'customer',
    initialState: CustomerInitialState,
    reducers: {
        fetchCustomerListingRequest(state) {
            state.customerListing.loading = true;
            state.customerListing.error = null;
        },
        fetchCustomerListingSuccess(state, action: PayloadAction<IUserListResponse>) {
            state.customerListing.loading = false;
            state.customerListing.data = action.payload;
        },
        fetchCustomerListingFailure(state, action: PayloadAction<string>) {
            state.customerListing.loading = false;
            state.customerListing.error = action.payload;
        },
        resetCustomerListing(state) {
            state.customerListing = CustomerInitialState.customerListing;
        },
        fetchCustomerDetailsRequest(state) {
            state.customerDetails.loading = true;
            state.customerDetails.error = null;
        },
        fetchCustomerDetailsSuccess(state, action: PayloadAction<ICustomer>) {
            state.customerDetails.loading = false;
            state.customerDetails.data = action.payload;
        },
        fetchCustomerDetailsFailure(state, action: PayloadAction<string>) {
            state.customerDetails.loading = false;
            state.customerDetails.error = action.payload;
        },
        resetCustomerDetails(state) {
            state.customerDetails = CustomerInitialState.customerDetails;
        },
        setBlockStatusRequest(state) {
            state.customerDetails.loading = true;
            state.customerDetails.error = null;
        },
        setBlockStatusSuccess(state, action: PayloadAction<boolean>) {
            state.customerDetails.loading = false;
            state.customerDetails.blockStatus = action.payload;
        },
        setBlockStatusFailure(state, action: PayloadAction<string>) {
            state.customerDetails.loading = false;
            state.customerDetails.error = action.payload;
        },
        resetBlockStatus(state) {
            state.customerDetails.blockStatus = CustomerInitialState.customerDetails.blockStatus;
        },
    },
});

export const {
    fetchCustomerListingRequest,
    fetchCustomerListingSuccess,
    fetchCustomerListingFailure,
    resetCustomerListing,
    fetchCustomerDetailsRequest,
    fetchCustomerDetailsSuccess,
    fetchCustomerDetailsFailure,
    resetCustomerDetails,
    setBlockStatusRequest,
    setBlockStatusSuccess,
    setBlockStatusFailure,
    resetBlockStatus
} = customerSlice.actions;

export const CustomerReducer = customerSlice.reducer;
