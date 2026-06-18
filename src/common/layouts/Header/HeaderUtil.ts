export enum MenuColor {
  WHITECOLOR = '#FFFFFF',
  PRIMARY = '#000000',
}





export interface INotificationListData {
  id: number,
  userId: number,
  title: string,
  message: string,
  isRead: boolean,
  topic: string,
  read: boolean,
  requestId: string,
  createdAt: string,
  type: string,
}
enum INotificationTitile {
  NEW_RIDER_ONBOARD = 'Rider Onboarding',
  RIDER='RIDER',
  NEW_TICKET_CREATED = 'NEW TICKET CREATED',
  NEW_RESTAURENT_ONBOARD = 'Onboarding',
  NEW__CUSTOMER_TICKET_RAISED = 'New Ticket Raised by CUSTOMER',
  New_RIDER_TICKET_RAISED = 'New Ticket Raised by RIDER',
  PAYMENT_ISSUES ='PAYMENT_ISSUES',
  REFUND ='REFUND',
  USER_NOT_CONTACTABLE='USER_NOT_CONTACTABLE',
  ACCIDENT='ACCIDENT',
  ADDRESS_NOT_FOUND='ADDRESS_NOT_FOUND',
  PASSENGER_DID_NOT_SHOW_UP='PASSENGER_DID_NOT_SHOW_UP',
  ROUTE_CHANGED='ROUTE_CHANGED',
  PASSENGER_NOT_READY_FOR_PICKUP='PASSENGER_NOT_READY_FOR_PICKUP',
  PASSENGER_NOT_CONTACTABLE='PASSENGER_NOT_CONTACTABLE',
  WRONG_DESTINATION='WRONG_DESTINATION',
  DRIVER_NOT_ARRIVED='DRIVER_NOT_ARRIVED',
  UNSAFE_OR_RUDE_DRIVER='UNSAFE_OR_RUDE_DRIVER',
  DOUBLE_CHARGE_FOR_RIDE='DOUBLE_CHARGE_FOR_RIDE',
  WRONG_ROUTE_TAKEN='WRONG_ROUTE_TAKEN',
  UNABLE_TO_TRACK_DRIVER='UNABLE_TO_TRACK_DRIVER',
  DRIVER_CANCELLED_BUT_CHARGED='DRIVER_CANCELLED_BUT_CHARGED',
  CANNOT_UPDATE_DESTINATION='CANNOT_UPDATE_DESTINATION',
  OTHER = 'OTHER'
}

export interface INotifcationResponse extends IItemPageList {
  data: INotificationListData[],
}

export interface IItemPageList {
  total: number;
  page: number;
  size: number;
}

export interface IUnreadCount {
  unreadCount: number
}

export interface IUnreadCount {
  unreadCount: number
}

export {  INotificationTitile };
