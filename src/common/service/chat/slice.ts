import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChatResponse } from 'src/components/Chat/ChatUtils';

export interface SupportListingState {
    loading: boolean;
    error: string | null;
    data: IChatResponse;
}

export interface ChatState {
    supportListing: SupportListingState;
}

export const supportInitialState: ChatState = {
    supportListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
    }
};

const supportSlice = createSlice({
    name: 'support',
    initialState: supportInitialState,
    reducers: {
        fetchSupportListingRequest(state) {
            state.supportListing.loading = true;
            state.supportListing.error = null;
        },

        fetchSupportListingSuccess(state, action: PayloadAction<IChatResponse>) {
            state.supportListing.loading = false;
            const incoming = action.payload;
        
            if (incoming.page === 0) {
                state.supportListing.data.data = incoming.data;
            } 
            else {
                state.supportListing.data.data = [
                    ...state.supportListing.data.data,
                    ...incoming.data
                ];
            }
            state.supportListing.data.page = incoming.page;
            state.supportListing.data.size = incoming.size;
            state.supportListing.data.total = incoming.total;
        },
        fetchSupportListingFailure(state, action: PayloadAction<string>) {
            state.supportListing.loading = false;
            state.supportListing.error = action.payload;
        },

        resetSupportListing(state) {
            state.supportListing = supportInitialState.supportListing;
        }
    },
});

export const {
    fetchSupportListingRequest,
    fetchSupportListingSuccess,
    fetchSupportListingFailure,
    resetSupportListing,
} = supportSlice.actions;

export const SupportReducer = supportSlice.reducer;
