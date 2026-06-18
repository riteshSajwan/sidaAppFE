import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotifcationResponse } from 'src/common/layouts/Header/HeaderUtil';

export interface SelectedNotificationState {
    requestId?: string;
    type?: string;
  }
  
export interface NotificationState {
    notificationListing: NotificationListingState;
    notificationReadStatus: boolean | null;
    selectedNotification: SelectedNotificationState | null; 
}

export interface NotificationListingState {
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    data: INotifcationResponse;
}

export const notificationInitialState: NotificationState = {
    notificationListing: {
        loading: false,
        error: null,
        hasMore: true,
        data: { data: [], total: 0, page: 0, size: 0 },
    },
    notificationReadStatus: null,
    selectedNotification: null,      
};


const notificationSlice = createSlice({
    name: 'notification',
    initialState: notificationInitialState,
    reducers: {
        fetchNotificationListingRequest(state) {
            state.notificationListing.loading = true;
            state.notificationListing.error = null;
        },

        fetchNotificationListingSuccess(state, action) {
            state.notificationListing.loading = false;
            const incoming = action.payload;
            const isFirstPage = incoming.page === 0;
            if (isFirstPage) {
              state.notificationListing.data.data = incoming.data;
            } else {
              state.notificationListing.data.data = [
                ...state.notificationListing.data.data,
                ...incoming.data,
              ];
            }
            state.notificationListing.data.page = incoming.page;
            state.notificationListing.data.size = incoming.size;
            state.notificationListing.data.total = incoming.total;
            const totalPages = Math.ceil(incoming.total / incoming.size) - 1;
            state.notificationListing.hasMore = incoming.page < totalPages;
        },
        


        fetchNotificationListingFailure(state, action: PayloadAction<string>) {
            state.notificationListing.loading = false;
            state.notificationListing.error = action.payload;
        },

        resetNotificationListing(state) {
            state.notificationListing = notificationInitialState.notificationListing;
        },
        setNotificationReadStatus(state, action: PayloadAction<boolean | null>) {
            state.notificationReadStatus = action.payload;
        },
        setSelectedNotification(state,action: PayloadAction<SelectedNotificationState | null>) {
            state.selectedNotification = action.payload;
        },
          
    },
});

export const {
    fetchNotificationListingRequest,
    fetchNotificationListingSuccess,
    fetchNotificationListingFailure,
    resetNotificationListing,
    setNotificationReadStatus,
    setSelectedNotification
} = notificationSlice.actions;

export const NotificationReducer = notificationSlice.reducer;
