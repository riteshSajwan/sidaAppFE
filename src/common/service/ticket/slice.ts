import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDriver } from 'src/components/DriverDetailPage/Add/DriverDetailUtil';
import { IDriverListResponse } from 'src/components/DriverDetailPage/DriverListUtil';
import { ITicket } from 'src/components/TicketPage/TicketDetailUtil';
import { ITickeListResponse } from 'src/components/TicketPage/TicketListUtil';


export interface TicketListingState {
    loading: boolean;
    error: string | null;
    data: ITickeListResponse;
}
interface TicketDetailsState {
    loading: boolean;
    error: string | null;
    data: ITicket | null;
}
interface TicketStatusUpdateState {
    loading: boolean;
    error: string | null;
    success: boolean;
}
export interface TicketState {
    ticketListing: TicketListingState;
    ticketDetails: TicketDetailsState;
    ticketStatusUpdate: TicketStatusUpdateState;
}

export const ticketInitialState: TicketState = {
    ticketListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
    },
    ticketDetails: {
        loading: false,
        error: null,
        data: null,
    },
    ticketStatusUpdate: {
        loading: false,
        error: null,
        success: false,
    },
};

const ticketSlice = createSlice({
    name: 'ticket',
    initialState: ticketInitialState,
    reducers: {
        fetchTicketListingRequest(state) {
            state.ticketListing.loading = true;
            state.ticketListing.error = null;
        },
        fetchTicketListingSuccess(state, action: PayloadAction<ITickeListResponse>) {
            state.ticketListing.loading = false;
            state.ticketListing.data = action.payload;
        },
        fetchTicketListingFailure(state, action: PayloadAction<string>) {
            state.ticketListing.loading = false;
            state.ticketListing.error = action.payload;
        },
        resetTicketListing(state) {
            state.ticketListing = ticketInitialState.ticketListing;
        },
        fetchTicketDetailsRequest(state) {
            state.ticketDetails.loading = true;
            state.ticketDetails.error = null;
        },
        fetchTicketDetailsSuccess(state, action: PayloadAction<ITicket>) {
            state.ticketDetails.loading = false;
            state.ticketDetails.data = action.payload;
        },
        fetchTicketDetailsFailure(state, action: PayloadAction<string>) {
            state.ticketDetails.loading = false;
            state.ticketDetails.error = action.payload;
        },
        resetTicketDetails(state) {
            state.ticketDetails = ticketInitialState.ticketDetails;
        },
        updateTicketStatusRequest(state) {
            state.ticketStatusUpdate.loading = true;
            state.ticketStatusUpdate.error = null;
            state.ticketStatusUpdate.success = false;
        },
        updateTicketStatusSuccess(state) {
            state.ticketStatusUpdate.loading = false;
            state.ticketStatusUpdate.success = true;
        },
        updateTicketStatusFailure(state, action: PayloadAction<string>) {
            state.ticketStatusUpdate.loading = false;
            state.ticketStatusUpdate.error = action.payload;
            state.ticketStatusUpdate.success = false;
        },
        resetTicketStatus(state) {
            state.ticketStatusUpdate = ticketInitialState.ticketStatusUpdate;
        },
    },
});

export const {
    fetchTicketListingRequest,
    fetchTicketListingSuccess,
    fetchTicketListingFailure,
    resetTicketListing,
    fetchTicketDetailsRequest,
    fetchTicketDetailsSuccess,
    fetchTicketDetailsFailure,
    resetTicketDetails,
    updateTicketStatusRequest,
    updateTicketStatusSuccess,
    updateTicketStatusFailure,
    resetTicketStatus
} = ticketSlice.actions;

export const TicketReducer = ticketSlice.reducer;
