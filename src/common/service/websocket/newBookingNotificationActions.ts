import {
    NewBookingNotification,
    showNewBookingNotification,
} from 'src/common/service/websocket/newBookingNotificationSlice';
import { AppThunk } from 'src/store';

export enum WsMessageType {
  NEW_RIDE_REQUESTED = 'NEW_RIDE_REQUESTED',
  NEW_ORDER = 'NEW_ORDER',
  NEW_BOOKING = 'NEW_BOOKING',
}

export interface INewBookingMessage {
  type?: string;
  orderId?: string | number;
  customerName?: string;
  sourceName?: string;
  [key: string]: unknown;
}

const normalizeMessage = (msg: INewBookingMessage): NewBookingNotification | null => {
  const isNewBooking =
    msg?.type === WsMessageType.NEW_RIDE_REQUESTED ||
    msg?.type === WsMessageType.NEW_ORDER ||
    msg?.type === WsMessageType.NEW_BOOKING;

  const bookingId =
    msg?.orderId ??
    (msg?.order as INewBookingMessage | undefined)?.orderId ??
    null;

  if (!isNewBooking && !bookingId) return null;

  return {
    bookingId: bookingId ? String(bookingId) : '',
    customerName: msg?.customerName ?? '',
    sourceName: msg?.sourceName ?? '',
  };
};

export const handleNewBookingNotification =
  (message: INewBookingMessage): AppThunk =>
  (dispatch) => {
    const notification = normalizeMessage(message);
    if (!notification) return;
    dispatch(showNewBookingNotification(notification));
  };
