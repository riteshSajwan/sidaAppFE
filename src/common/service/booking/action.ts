import { assignRiderToBooking, cancelBookingByAdmin, completeRideByAdmin, getBookingList, getNewBookingList, getRideDetails, getRiderMonthlySchedule, getRoundTripDetails, getUserBookingList, unassignRiderFromBooking } from 'src/common/service/booking/api';
import {
    assignBookingFailure,
    assignBookingRequest,
    assignBookingSuccess,
    cancelBookingFailure,
    cancelBookingRequest,
    cancelBookingSuccess,
    completeRideFailure,
    completeRideRequest,
    completeRideSuccess,
    fetchBookingListingFailure,
    fetchBookingListingRequest,
    fetchBookingListingSuccess,
    fetchNewBookingListingFailure,
    fetchNewBookingListingRequest,
    fetchNewBookingListingSuccess,
    fetchRideDetailsFailure,
    fetchRideDetailsRequest,
    fetchRideDetailsSuccess,
    fetchRiderMonthlyScheduleFailure,
    fetchRiderMonthlyScheduleRequest,
    fetchRiderMonthlyScheduleSuccess,
    fetchRoundTripDetailsFailure,
    fetchRoundTripDetailsRequest,
    fetchRoundTripDetailsSuccess
} from 'src/common/service/booking/slice';
import { IBookingListFilter } from 'src/components/Booking/BookingListUtil';
import { IBookingListFilter as INewBookingListFilter } from 'src/components/NewBooking/NewBookingListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';


  
export const fetchBookingListingAction = (filter: IBookingListFilter,page: number,size: number): AppThunk => (dispatch) => {
    dispatch(fetchBookingListingRequest());
    return getBookingList(filter, page, size)
      .then((result) => {
        dispatch(fetchBookingListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchBookingListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };

export const fetchNewBookingListingAction = (filter: INewBookingListFilter,page: number,size: number): AppThunk => (dispatch) => {
    dispatch(fetchNewBookingListingRequest());
    return getNewBookingList(filter, page, size)
      .then((result) => {
        dispatch(fetchNewBookingListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchNewBookingListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };

export const assignBookingToRiderAction = (riderId: number, orderId: number): AppThunk<Promise<boolean>> => (dispatch) => {
    dispatch(assignBookingRequest());
    return assignRiderToBooking(riderId, orderId)
      .then((result) => {
        if (result !== true) {
          dispatch(assignBookingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
          return false;
        }

        dispatch(assignBookingSuccess(translateMessage('Admin.Delivery.App.Booking.Assign.Rider.Success')));
        return true;
      })
      .catch(() => {
        dispatch(assignBookingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return false;
      });
  };

export const unassignBookingFromRiderAction = (
  riderId: number,
  orderId: number,
  requestBody: number[] = []
): AppThunk<Promise<boolean>> => (dispatch) => {
    dispatch(assignBookingRequest());
    return unassignRiderFromBooking(riderId, orderId, requestBody)
      .then((result) => {
        if (result !== true) {
          dispatch(assignBookingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
          return false;
        }

        dispatch(assignBookingSuccess(translateMessage('Admin.Delivery.App.Booking.Unassign.Rider.Success')));
        return true;
      })
      .catch(() => {
        dispatch(assignBookingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return false;
      });
  };

export const cancelBookingByAdminAction = (orderId: number, reason: string): AppThunk<Promise<boolean>> => (dispatch) => {
    dispatch(cancelBookingRequest());
    return cancelBookingByAdmin({ orderId, reason })
      .then((result) => {
        if (result !== true) {
          dispatch(cancelBookingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
          return false;
        }

        dispatch(cancelBookingSuccess());
        return true;
      })
      .catch(() => {
        dispatch(cancelBookingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return false;
      });
  };

export const completeRideByAdminAction = (orderId: number): AppThunk<Promise<boolean>> => (dispatch) => {
  dispatch(completeRideRequest());
  return completeRideByAdmin(orderId)
    .then((result) => {
      if (result !== true) {
        dispatch(completeRideFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return false;
      }
      dispatch(completeRideSuccess());
      return true;
    })
    .catch(() => {
      dispatch(completeRideFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      return false;
    });
};

export const fetchRideDetailsAction = (rideId: number): AppThunk => (dispatch) => {
    dispatch(fetchRideDetailsRequest());
    return getRideDetails(rideId)
      .then((response) => {
        dispatch(fetchRideDetailsSuccess(response));
        return response;
      })
      .catch((err) => {
        dispatch(fetchRideDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        throw err;
      });
  };
   
  export const fetchUIserBookingListingAction = (
    filter: IBookingListFilter,
    page: number,
    size: number,
    id: number,
    role: string,
    rideType?: string
  ): AppThunk => (dispatch) => {
    dispatch(fetchBookingListingRequest());
    return getUserBookingList(filter, page, size, id, role, rideType)
      .then((result) => {
        dispatch(fetchBookingListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchBookingListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };

export const fetchRoundTripDetailsAction = (rideId: number): AppThunk => (dispatch) => {
  dispatch(fetchRoundTripDetailsRequest());
  return getRoundTripDetails(rideId)
    .then((response) => {
      dispatch(fetchRoundTripDetailsSuccess(response));
      return response;
    })
    .catch((err) => {
      dispatch(fetchRoundTripDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      throw err;
    });
};

export const fetchRiderMonthlyScheduleAction = (
  riderId: number,
  bookingDate: string
): AppThunk => (dispatch) => {
  dispatch(fetchRiderMonthlyScheduleRequest());
  return getRiderMonthlySchedule({ riderId, bookingDate })
    .then((response) => {
      dispatch(fetchRiderMonthlyScheduleSuccess(response));
      return response;
    })
    .catch(() => {
      dispatch(fetchRiderMonthlyScheduleFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      return undefined;
    });
};
