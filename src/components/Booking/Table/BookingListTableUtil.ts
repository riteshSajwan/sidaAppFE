import { ReactNode } from 'react';
import { ThemeType } from 'src/common/themes';
import { IBooking, IBookingListFilter, IBookingListResponse } from 'src/components/Booking/BookingListUtil';
import { TLocaleId } from 'src/i18n/localesTypes';

interface TableColumn<T> {
    flex?: number;
    minWidth?: number;
    width?: number;
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
    handleSort?: (key: keyof IBooking) => void;
    selectedBookingId?: number | null;
    onSelectBooking?: (bookingId: number) => void;
    error?: string;
}
enum IBookingType {
    OPEN = 'OPEN',
    CANCELLED = 'CANCELLED',
    SCHEDULED='SCHEDULED',
    RIDE_COMPLETED='RIDE_COMPLETED',
    ARRIVED_AT_PICKUP_LOCATION='ARRIVED_AT_PICKUP_LOCATION',
    IN_PROGRESS = 'IN_PROGRESS',
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    RIDER_ASSIGNED = 'RIDER_ASSIGNED',
    REJECTED = 'REJECTED',
    NO_RIDER_FOUND = 'NO_RIDER_FOUND',
    AWAITING_PAYMENT='AWAITING_PAYMENT',
  }
const bookingStatusLabel: {[key in IBookingType]: TLocaleId}={
    [IBookingType.OPEN]:'Admin.Delivery.App.OrderList.Filter.OPEN',
    [IBookingType.CANCELLED]:'Admin.Delivery.App.Dashboard.Cancelled',
    [IBookingType.SCHEDULED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Scheduled',
    [IBookingType.RIDE_COMPLETED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Completed',
    [IBookingType.ARRIVED_AT_PICKUP_LOCATION]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Arrived.At.Pickup',
    [IBookingType.IN_PROGRESS]:'Admin.Delivery.App.Booking.Ride.Status.Ride.InProgress',
    [IBookingType.REQUESTED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Requested',
    [IBookingType.ACCEPTED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Accepted',
    [IBookingType.RIDER_ASSIGNED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Rider.Assigned',
    [IBookingType.REJECTED]:'Admin.Delivery.App.Booking.Ride.Status.Ride.Rejected',
    [IBookingType.NO_RIDER_FOUND]:'Admin.Delivery.App.Booking.Ride.Status.No.Rider.Found',
    [IBookingType.AWAITING_PAYMENT]:'Admin.Delivery.App.Booking.Payment.Awaited',
 }

interface IBookingStatusAppearance {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
}

function getBookingStatusAppearance(
    status: IBookingType,
    theme: ThemeType
): IBookingStatusAppearance {
    switch (status) {
        case IBookingType.REQUESTED:
            return {
                backgroundColor: theme.colors.surfaceBase,
                borderColor: theme.colors.borderLinkInverse,
                textColor: theme.colors.textLinkDark,
            };
        case IBookingType.ACCEPTED:
            return {
                backgroundColor: theme.colors.surfaceSecondaryBase,
                borderColor: theme.colors.borderSecondaryInverse,
                textColor: theme.colors.textBody,
            };
        case IBookingType.RIDER_ASSIGNED:
            return {
                backgroundColor: theme.colors.surfaceSuccessBase,
                borderColor: theme.colors.borderSuccessInverse,
                textColor: theme.colors.textSuccessDark,
            };
        case IBookingType.CANCELLED:
        case IBookingType.REJECTED:
        case IBookingType.NO_RIDER_FOUND:
            return {
                backgroundColor: theme.colors.surfaceBase,
                borderColor: theme.colors.borderErrorInverse,
                textColor: theme.colors.textErrorDark,
            };
        case IBookingType.ARRIVED_AT_PICKUP_LOCATION:
            return {
                backgroundColor: theme.colors.surfaceWarningBase,
                borderColor: theme.colors.borderWarningInverse,
                textColor: theme.colors.textWarningDark,
            };
        case IBookingType.IN_PROGRESS:
            return {
                backgroundColor: theme.colors.surfaceSecondaryBase,
                borderColor: theme.colors.borderSecondaryInverse,
                textColor: theme.colors.textBody,
            };
        case IBookingType.RIDE_COMPLETED:
            return {
                backgroundColor: theme.colors.surfaceSuccessInverse,
                borderColor: theme.colors.borderSuccessInverse,
                textColor: theme.colors.textInverse,
            };
        case IBookingType.SCHEDULED:
            return {
                backgroundColor: theme.colors.surfaceLinkBase,
                borderColor: theme.colors.borderLinkInverse,
                textColor: theme.colors.textLinkDark,
            };
        case IBookingType.OPEN:
        default:
            return {
                backgroundColor: theme.colors.surfaceMedium,
                borderColor: theme.colors.borderMedium,
                textColor: theme.colors.textBody,
            };
    }
}

export { BookingListTableProps, bookingStatusLabel, getBookingStatusAppearance, IBookingListWithActions, IBookingType, TableColumn };
