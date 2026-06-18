import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum WsConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

export interface NewBookingNotification {
  bookingId: string;
  customerName: string;
  sourceName: string;
}

export interface NewBookingNotificationState {
  notification: NewBookingNotification | null;
  isVisible: boolean;
  connectionStatus: WsConnectionStatus;
  connectionError: string | null;
}

const initialState: NewBookingNotificationState = {
  notification: null,
  isVisible: false,
  connectionStatus: WsConnectionStatus.DISCONNECTED,
  connectionError: null,
};

const newBookingNotificationSlice = createSlice({
  name: 'newBookingNotification',
  initialState,
  reducers: {
    showNewBookingNotification(state, action: PayloadAction<NewBookingNotification>) {
      state.notification = action.payload;
      state.isVisible = true;
    },
    hideNewBookingNotification(state) {
      state.isVisible = false;
    },
    clearNewBookingNotification(state) {
      state.notification = null;
      state.isVisible = false;
    },
    setConnectionStatus(state, action: PayloadAction<WsConnectionStatus>) {
      state.connectionStatus = action.payload;
      if (action.payload !== WsConnectionStatus.CONNECTED) {
        state.connectionError = null;
      }
    },
    setConnectionError(state, action: PayloadAction<string | null>) {
      state.connectionError = action.payload;
      state.connectionStatus = WsConnectionStatus.DISCONNECTED;
    },
  },
});

export const {
  showNewBookingNotification,
  hideNewBookingNotification,
  clearNewBookingNotification,
  setConnectionStatus,
  setConnectionError,
} = newBookingNotificationSlice.actions;

export const NewBookingNotificationReducer = newBookingNotificationSlice.reducer;
