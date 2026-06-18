import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { IBookingType } from 'src/components/NewBooking/Table/NewBookingListTableUtil';
import { translateMessage } from 'src/i18n/createTranslation';

interface IBooking {
    id: number,
    userId: number,
    sourceLat:number,
    sourceLong:number,
    sourceName: string,
    destinationLat:number,
    destinationLong:number,
    destinationName: string,
    distance:number,
    totalAmount:number,
    currency: string,
    phoneNumber: string,
    riderPhoneNumber?: string | null,
    customerName: string,
    vehicleCategory: string,
    orderStatus: string,
    riderId?: number | null,
    riderName?: string | null,
    riderImage?: string | null,
    scheduledTime?:string,
    isRoundTrip?: boolean,
}

export const cancellationReasons = [
    translateMessage('Admin.Delivery.App.Cancel.Reason.Driver.Unavailable'),
    translateMessage('Admin.Delivery.App.Cancel.Reason.Customer.Requested'),
    translateMessage('Admin.Delivery.App.Cancel.Reason.Schedule.Conflict'),
    translateMessage('Admin.Delivery.App.Cancel.Reason.Vehicle.Issue'),
  ];

interface IBookingListResponse {
    data: IBooking[];
    page: number;
    size: number;
    total: number;
    statusCounts?: Partial<Record<IBookingType, number>>;
}

interface IBookingListFilter {
    // userName: string;
    // phoneNumber: string;
    // activeStatus: string;
    // firstName: string,
    // email: string;
    // createdAt: DateType | null;
    // sortField: string;
    searchKey: string;
    // sortOrder: string;
    // approvalRequestStatus: string;
    // type: string;
    // riderVehicleRegistration: { vehicleType: '' };
    // isBlockedFilter: string;
    // paymentMethod:string,
    // country: string;
    rideStatus:string
}
interface IRiderVehicleRegistration {
    vehicleType: string;
}
interface IBookingListTempFilter {
    rideStatus: string;
    searchKey: string;
}

interface IAprovalCountResponse {
    totalRequest: number;
    pendingRequest: number;
}

interface IScheduleMarkedDateDto {
    selected: boolean;
    marked: boolean;
    selectedColor: string;
}

type IScheduleMarkedDatesDto = Record<string, IScheduleMarkedDateDto>;

function generateDriverListData(): IBookingListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}

function generateInitialFilterData(): IBookingListFilter {
    return {
        // userName: '',
        // phoneNumber: '',
        // activeStatus: '',
        // email: '',
        // sortField: 'requestName',
        // sortOrder: 'asc',
        // approvalRequestStatus: '',
        // type: 'restaurant',
        // createdAt: null,
        searchKey: '',
        // firstName: '',
        // riderVehicleRegistration: { vehicleType: '' },
        // isBlockedFilter: '',
        // paymentMethod:'',
        // country:'',
        rideStatus:''

    }
}

function generateInitialTempFilterData(): IBookingListTempFilter {
    return {
        rideStatus: '',
        searchKey: '',
    }
}

function generateInitialApprovalCountData(): IAprovalCountResponse {
    return {
        totalRequest: 0,
        pendingRequest: 0,
    }
}

function getScheduledDate(dateTime?: string | null): string | null {
    return dateTime?.split('T')[0] ?? null;
}

function generateScheduleMarkedDatesDto(
    upcomingScheduledTimes: string[] | null | undefined,
    selectedColor: string
): IScheduleMarkedDatesDto {
    if (!upcomingScheduledTimes?.length) {
        return {};
    }

    return upcomingScheduledTimes.reduce<IScheduleMarkedDatesDto>((acc, scheduledTime) => {
        const date = getScheduledDate(scheduledTime);

        if (!date) {
            return acc;
        }

        acc[date] = {
            selected: true,
            marked: true,
            selectedColor,
        };

        return acc;
    }, {});
}

function getTranslatedVehicleCategory(
    vehicleCategory: string | null | undefined,
    translate: (key: string) => string
): string {
    const normalizedVehicleCategory = vehicleCategory?.trim();

    if (!normalizedVehicleCategory) {
        return '-';
    }

    const formattedVehicleCategory = normalizedVehicleCategory
        .toUpperCase()
        .replace(/[\s_]+/g, '');

    const vehicleCategoryTranslationKey =
        formattedVehicleCategory === 'SUV'
            ? 'Admin.Delivery.App.Vehicle.Category.SUV'
            : formattedVehicleCategory === 'STANDARD'
                ? 'Admin.Delivery.App.Vehicle.Category.Standard'
                : formattedVehicleCategory === 'FULLSIZE'
                    ? 'Admin.Delivery.App.Vehicle.Category.FullSize'
                    : null;

    return vehicleCategoryTranslationKey
        ? translate(vehicleCategoryTranslationKey)
        : normalizedVehicleCategory;
}


enum BookingType {
    Active = 'Active',
    Block = 'Block',
}
function rideStatusOptions() {
  return [
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Requested'),
    value: IBookingType.REQUESTED,
  },
  {
      label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Rider.Assigned'),
      value: IBookingType.RIDER_ASSIGNED,
    },
    {
      label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Accepted'),
      value: IBookingType.ACCEPTED,
    },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Arrived.At.Pickup'),
    value: IBookingType.ARRIVED_AT_PICKUP_LOCATION,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.InProgress'),
    value: IBookingType.IN_PROGRESS,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Completed'),
    value: IBookingType.RIDE_COMPLETED,
  },
  {
    label: translateMessage('Admin.Delivery.App.Dashboard.Cancelled'),
    value: IBookingType.CANCELLED,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Rejected'),
    value: IBookingType.REJECTED,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.No.Rider.Found'),
    value: IBookingType.NO_RIDER_FOUND,
  },
]
};


export {
    BookingType, generateDriverListData, generateInitialApprovalCountData, generateInitialFilterData, generateInitialTempFilterData, generateScheduleMarkedDatesDto, getScheduledDate, getTranslatedVehicleCategory, IAprovalCountResponse, IBooking, IBookingListFilter, IBookingListResponse, IBookingListTempFilter, IScheduleMarkedDateDto, IScheduleMarkedDatesDto, rideStatusOptions
};

