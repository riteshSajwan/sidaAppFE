import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { IBookingType } from 'src/components/Booking/Table/BookingListTableUtil';
import { translateMessage } from 'src/i18n/createTranslation';

type BookingDateFilter = Date | null;

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
    customerName: string,
    vehicleCategory: string,
    orderStatus: string, 
}



interface IBookingListResponse {
    data: IBooking[];
    page: number;
    size: number;
    total: number;
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
    rideStatus:string;
    rideType: string;
    startDate: BookingDateFilter;
    endDate: BookingDateFilter;
}
interface IRiderVehicleRegistration {
    vehicleType: string;
}
interface IBookingListTempFilter {
    rideStatus: string;
    searchKey: string;
    rideType: string;
    startDate: BookingDateFilter;
    endDate: BookingDateFilter;
}

interface IAprovalCountResponse {
    totalRequest: number;
    pendingRequest: number;
}

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
        rideStatus:'',
        rideType: '',
        startDate: null,
        endDate: null

    }
}

function generateInitialTempFilterData(): IBookingListTempFilter {
    return {
        rideStatus: '',
        searchKey: '',
        rideType: '',
        startDate: null,
        endDate: null,
    }
}

function generateInitialApprovalCountData(): IAprovalCountResponse {
    return {
        totalRequest: 0,
        pendingRequest: 0,
    }
}


enum BookingType {
    Active = 'Active',
    Block = 'Block',
}
function rideStatusOptions() {
  return [
  {
    label: translateMessage('Admin.Delivery.App.OrderList.Filter.OPEN'),
    value: IBookingType.OPEN,
  },
  {
    label: translateMessage('Admin.Delivery.App.Dashboard.Cancelled'),
    value: IBookingType.CANCELLED,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Scheduled'),
    value: IBookingType.SCHEDULED,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Completed'),
    value: IBookingType.RIDE_COMPLETED,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.Arrived.At.Pickup'),
    value: IBookingType.ARRIVED_AT_PICKUP_LOCATION,
  },
  {
    label: translateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.InProgress'),
    value: IBookingType.IN_PROGRESS,
  },

]
};

function rideTypeFilterOptions() {
  return [
    {
      label: translateMessage('Admin.Delivery.App.BookingHistory.AllRides'),
      value: '',
    },
    {
      label: translateMessage('Admin.Delivery.App.BookingHistory.Local'),
      value: 'LOCAL',
    },
    {
      label: translateMessage('Admin.Delivery.App.BookingHistory.Intercity'),
      value: 'INTERCITY',
    },
  ];
}


export {
	BookingType, generateDriverListData, generateInitialApprovalCountData, generateInitialFilterData, generateInitialTempFilterData, IAprovalCountResponse, IBooking, IBookingListFilter, IBookingListResponse, IBookingListTempFilter, rideStatusOptions, rideTypeFilterOptions
};
