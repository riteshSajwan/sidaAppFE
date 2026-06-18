import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { INotifcationResponse, IUnreadCount } from 'src/common/layouts/Header/HeaderUtil';



export const notificationListing = async (sellerId: number, payload: {page: number,size: number}): Promise<INotifcationResponse> => {
    const headers = await RestService.generateHeaders();
    const { page, size } = payload;
    const queryParams = [
      `page=${page}`,
      `size=${size}`,
      `search=${''}`,
      `userId=${sellerId}`
    ]
      .filter(Boolean)
      .join('&');
      
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/notification/firebase/getNotifications?${queryParams}`,
      {
        method: 'GET',
        headers,
      }
    );
  };

  export const unreadNotificationCount = async (userId: number): Promise<IUnreadCount> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/notification/firebase/getUnreadCount/${userId}`, {
      method: 'GET',
      headers
    })
  }
  
  export const markNotificationAsRead = async (notifcationId: number, isRead: boolean): Promise<boolean> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/notification/firebase/update-notification-status/${notifcationId}/${isRead}`, {
      method: 'PATCH',
      headers
    })
  }