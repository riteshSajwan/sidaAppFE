import { buildQueryParam } from 'src/common/service/ApiUtil';
import RestService from 'src/common/service/restService/restService';
import { formatYearMonthDate } from 'src/common/utils/dateUtil';
import { IPastRideListData } from 'src/components/Booking/Add/BookingDetailUtil';
import { IBookingListFilter, IBookingListResponse } from 'src/components/Booking/BookingListUtil';
import { IBookingListFilter as INewBookingListFilter, IBookingListResponse as INewBookingListResponse, } from 'src/components/NewBooking/NewBookingListUtil';

import { AUTH_BASE_URL } from 'src/constants';

interface IRiderMonthlyScheduleRequest {
  riderId: number;
  bookingDate: string;
}

interface IRiderMonthlyScheduleResponse {
  riderId: number;
  upcomingScheduledTimes: string[];
}

interface ICancelBookingByAdminRequest {
  orderId: number;
  reason: string;
}

const buildBookingQueryParams = (
  filter: IBookingListFilter | INewBookingListFilter,
  page?: number,
  size?: number,
  fallbackRideType?: string
) => {
  const formattedStartDate = filter.startDate ? formatYearMonthDate(filter.startDate) : null;
  const formattedEndDate = filter.endDate ? formatYearMonthDate(filter.endDate) : null;

  return [
    buildQueryParam('rideType', filter.rideType || fallbackRideType),
    buildQueryParam('status', filter.rideStatus),
    buildQueryParam('startDate', formattedStartDate),
    buildQueryParam('endDate', formattedEndDate),
    `page=${page}`,
    `size=${size}`,
  ]
    .filter(Boolean)
    .join('&');
};

const getBookingList = (filter: IBookingListFilter,page?: number,size?: number): Promise<IBookingListResponse> => {
  const queryParams = buildBookingQueryParams(filter, page, size, 'LOCAL');

  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/order/getAllRides?${queryParams}`,
      {
        method: "GET",
        headers,
      }
    );
  });
};
const getNewBookingList = (
  filter: INewBookingListFilter,
  page?: number,
  size?: number
): Promise<INewBookingListResponse> => {
  const queryParams = buildBookingQueryParams(filter, page, size, 'INTERCITY');

  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/order/getAllRides?${queryParams}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};
const getRideDetails = (rideId: number): Promise<IPastRideListData> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/getOrderById/${rideId}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

const getRoundTripDetails = (rideId: number): Promise<IPastRideListData> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/getRoundTripDetails/${rideId}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};
const assignRiderToBooking = (riderId: number, orderId: number): Promise<unknown> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/assign-rider/${riderId}?orderId=${orderId}`,
      {
        method: 'PUT',
        headers,
      }
    );
  });
};

const unassignRiderFromBooking = (
  riderId: number,
  orderId: number,
  requestBody: number[] = []
): Promise<unknown> => {
  return RestService.generateHeaders({
    'Content-Type': 'application/json',
  }).then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/unassign-rider/${riderId}?orderId=${orderId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      }
    );
  });
};
const cancelBookingByAdmin = ({
  orderId,
  reason,
}: ICancelBookingByAdminRequest): Promise<unknown> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/cancel-order-by-admin?orderId=${orderId}&reason=${encodeURIComponent(reason)}`,
      {
        method: 'PUT',
        headers,
      }
    );
  });
};
const getUserBookingList = (
  filter: IBookingListFilter,
  page?: number,
  size?: number,
  id?: number,
  role?: string,
  rideType?: string
): Promise<IBookingListResponse> => {
  const queryParams = buildBookingQueryParams(filter, page, size, rideType);

  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/order/get-previous-rides/${role}/${id}?${queryParams}`,
      {
        method: "GET",
        headers,
      }
    );
  });
};

const completeRideByAdmin = (orderId: number): Promise<unknown> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/complete-order-by-admin?orderId=${orderId}`,
      {
        method: 'PUT',
        headers,
      }
    );
  });
};

const getRiderMonthlySchedule = (
  payload: IRiderMonthlyScheduleRequest
): Promise<IRiderMonthlyScheduleResponse> => {
  return RestService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  }).then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/get-rider-monthly-schedule`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }
    );
  });
};

export {
  assignRiderToBooking,
  cancelBookingByAdmin,
  completeRideByAdmin,
  getBookingList,
  getNewBookingList,
  getRideDetails, getRiderMonthlySchedule, getRoundTripDetails, getUserBookingList,
  ICancelBookingByAdminRequest,
  IRiderMonthlyScheduleRequest,
  IRiderMonthlyScheduleResponse,
  unassignRiderFromBooking
};

