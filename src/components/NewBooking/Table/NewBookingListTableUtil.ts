import { ReactNode } from 'react';
import { IBooking, IBookingListFilter, IBookingListResponse } from 'src/components/NewBooking/NewBookingListUtil';
import { TLocaleId } from 'src/i18n/localesTypes';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    isDashboard?:boolean;
}

type IBookingListWithActions = IBooking & {
    actions?: unknown;
};

interface BookingListTableProps {
    BookingListData: IBookingListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter: IBookingListFilter ;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    onCancelBooking?: (booking: IBooking) => void;
    onUnassignRider?: (booking: IBooking) => void;
    handleSort?: (key: keyof IBooking) => void;
    selectedBookingId?: number | null;
    onSelectBooking?: (bookingId: number) => void;
    error?: string;
}
enum IBookingType {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    RIDER_ASSIGNED = 'RIDER_ASSIGNED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
    SCHEDULED='SCHEDULED',
    RIDE_COMPLETED='RIDE_COMPLETED',
    ARRIVED_AT_PICKUP_LOCATION='ARRIVED_AT_PICKUP_LOCATION',
    IN_PROGRESS = 'IN_PROGRESS',
    NO_RIDER_FOUND = 'NO_RIDER_FOUND',
  }
const bookingStatusLabel: {[key in IBookingType]: TLocaleId}={
    [IBookingType.REQUESTED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Requested',
    [IBookingType.ACCEPTED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Accepted',
    [IBookingType.RIDER_ASSIGNED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Rider.Assigned',
    [IBookingType.CANCELLED]:'Admin.Delivery.App.Dashboard.Cancelled',
    [IBookingType.SCHEDULED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Scheduled',
    [IBookingType.RIDE_COMPLETED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Completed',
    [IBookingType.ARRIVED_AT_PICKUP_LOCATION]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Arrived.At.Pickup',
    [IBookingType.IN_PROGRESS]:'Admin.Delivery.App.Booking.Ride.Status.Ride.InProgress',
    [IBookingType.REJECTED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Rejected',
    [IBookingType.NO_RIDER_FOUND]:'Admin.Delivery.App.Booking.Ride.Status.No.Rider.Found',
 }

export { BookingListTableProps, bookingStatusLabel, IBookingListWithActions, IBookingType, TableColumn };
