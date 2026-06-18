import { markNotificationAsRead, notificationListing } from 'src/common/service/notification/api';
import { fetchNotificationListingFailure, fetchNotificationListingRequest, fetchNotificationListingSuccess, setNotificationReadStatus } from 'src/common/service/notification/slice';
import { decrementNotificationCount } from 'src/common/service/profile/slice';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchNotificationListAction = ( sellerId: number, payload: {page: number,size: number}): AppThunk => (dispatch) => {
    dispatch(fetchNotificationListingRequest());
    return notificationListing(sellerId,payload)
      .then((result) => {
        dispatch(fetchNotificationListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchNotificationListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
  };
  
export const markNotificationReadAction =(id: number, isRead: boolean): AppThunk =>(dispatch) => {
    return markNotificationAsRead(id, true).then((status) => {
        dispatch(setNotificationReadStatus(status));

        if (!isRead) {
          dispatch(decrementNotificationCount(1));
        }

        return status;
      })
      .catch((error) => {
        dispatch(setNotificationReadStatus(false));
        return false;
      });
  };
