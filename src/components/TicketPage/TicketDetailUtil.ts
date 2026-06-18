import { TLocaleId } from 'src/i18n/localesTypes';
import { translateMessage } from 'src/i18n/createTranslation'
interface ITicket {
    id: number;
    orderId: string;
    transactionId?: string;
    ticketStatus: string;
    ticketTarget: string;
    ticketType: string;
    description: string;
    createdAt:string;
    comments: string | null;
    ticketTypeDescription:string
    ticketImageUrl: string|null;
    userRole:string
  }
enum IUSERROLE{
CUSTOMER = 'CUSTOMER',
SELLER = 'SELLER',
RIDER='RIDER',
ADMIN='ADMIN',
OTHER='OTHER'
}

enum IStatusType {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    ALL='ALL'
  }
interface IMinuteOption {
    label: string;
    value: string;
}

  
interface ITicketStatusRequest {
    id: string;
    ticketStatus: IStatusType;
    comments: string;
}
 export enum RiderReportReasons {
    ACCIDENT='ACCIDENT',
    ADDRESS_NOT_FOUND='ADDRESS_NOT_FOUND',
    PASSENGER_DID_NOT_SHOW_UP='PASSENGER_DID_NOT_SHOW_UP',
    ROUTE_CHANGED='ROUTE_CHANGED',
    PASSENGER_NOT_READY_FOR_PICKUP='PASSENGER_NOT_READY_FOR_PICKUP',
    PASSENGER_NOT_CONTACTABLE='PASSENGER_NOT_CONTACTABLE',
    WRONG_DESTINATION='WRONG_DESTINATION',

}

enum PassengerReportReasons {
    DRIVER_NOT_ARRIVED='DRIVER_NOT_ARRIVED',
    UNSAFE_OR_RUDE_DRIVER='UNSAFE_OR_RUDE_DRIVER',
    DOUBLE_CHARGE_FOR_RIDE='DOUBLE_CHARGE_FOR_RIDE',
    WRONG_ROUTE_TAKEN='WRONG_ROUTE_TAKEN',
    UNABLE_TO_TRACK_DRIVER='UNABLE_TO_TRACK_DRIVER',
    DRIVER_CANCELLED_BUT_CHARGED='DRIVER_CANCELLED_BUT_CHARGED',
    CANNOT_UPDATE_DESTINATION='CANNOT_UPDATE_DESTINATION',
    OTHER = 'OTHER'
}
export enum RefundTicketType {
    PAYMENT_ISSUES = 'PAYMENT_ISSUES',
    REFUND = 'REFUND'
  }
const ReportReasonLabelKeys: Record<string, string> = {
    [RiderReportReasons.ACCIDENT]: 'Admin.Delivery.App.Accident',
    [RiderReportReasons.ADDRESS_NOT_FOUND]: 'Admin.Delivery.App.Address.Not.Found',
    [RiderReportReasons.PASSENGER_DID_NOT_SHOW_UP]: 'Admin.Delivery.App.Passenger.Didnot.shown',
    [RiderReportReasons.PASSENGER_NOT_CONTACTABLE]: 'Admin.Delivery.App.User.Not.Contactable',
    [RiderReportReasons.PASSENGER_NOT_READY_FOR_PICKUP]: 'Admin.Delivery.App.Passenger.Not.Ready',
    [RiderReportReasons.ROUTE_CHANGED]: 'Admin.Delivery.App.Route.Changed',
    [RiderReportReasons.WRONG_DESTINATION]: 'Admin.Delivery.App.Wrong.Destination',
    [PassengerReportReasons.CANNOT_UPDATE_DESTINATION]: 'Admin.Delivery.App.Cannot.Update.Destination',
    [PassengerReportReasons.DRIVER_NOT_ARRIVED]: 'Admin.Delivery.App.Did.Not.Arrive',
    [PassengerReportReasons.UNSAFE_OR_RUDE_DRIVER]: 'Admin.Delivery.App.Unsafe',
    [PassengerReportReasons.DOUBLE_CHARGE_FOR_RIDE]: 'Admin.Delivery.App.Double.Charge',
    [PassengerReportReasons.WRONG_ROUTE_TAKEN]: 'Admin.Delivery.App.Wrong.Route',
    [PassengerReportReasons.DRIVER_CANCELLED_BUT_CHARGED]: 'Admin.Delivery.App.Cancelled.Charged',
    [PassengerReportReasons.UNABLE_TO_TRACK_DRIVER]: 'Admin.Delivery.App.Track.Issue',
    [PassengerReportReasons.OTHER]: 'Admin.Delivery.App.Other.Reason',
    [RefundTicketType.PAYMENT_ISSUES]: 'Admin.Delivery.Ticket.Payment.Issues',
    [RefundTicketType.REFUND]: 'Admin.Delivery.Ticket.Refund',

    
  };
  export function getTicketLabelByKey(key: string | undefined | null): string {
    if (!key) return '';
    const translationKey = ReportReasonLabelKeys[key];
    return translationKey ? translateMessage(translationKey) : key;
  }
  
  

const ticketStatusLabel: {[key in IStatusType]: TLocaleId}={
    [IStatusType.OPEN]:'Admin.Delivery.App.OrderList.Filter.OPEN',
    [IStatusType.CLOSED]:'Admin.Delivery.App.OrderList.Filter.Close',
    [IStatusType.ALL]:'Admin.Delivery.App.OrderList.Filter.All'
 }
 const ticketTarget: {[key in IUSERROLE]: TLocaleId}={
    [IUSERROLE.CUSTOMER]:'Admin.Delivery.App.Customer',
    [IUSERROLE.RIDER]:'Admin.Delivery.App.Driver',
    [IUSERROLE.SELLER]:'Admin.Delivery.App.Restaurant',
    [IUSERROLE.ADMIN]:'Admin.Delivery.App.Admin',
    [IUSERROLE.OTHER]:'Admin.Delivery.App.Other'
 }
function generateIntialTicketData(): ITicket {
    return {
        id: 0,
        orderId: '',
        ticketStatus: '',
        ticketTarget: '',
        ticketType: '',
        description: '',
        comments: '',
        createdAt:'',
        ticketImageUrl:'',
        ticketTypeDescription: '',
        userRole:'',
        transactionId:''
    };
}

async function getInitialOnDataTicket(
    customerDataResponse: ITicket
) {
    const {  id, orderId, ticketStatus, ticketTarget, ticketType, description,  createdAt, comments,ticketImageUrl,ticketTypeDescription,userRole,transactionId } = customerDataResponse;
    const data = {
        id: id,
        orderId,
        ticketStatus,
        ticketTarget,
        ticketType,
        description,
        comments,
        ticketImageUrl,
        ticketTypeDescription,
        createdAt,
        userRole,
        transactionId
    }
    return data
}

export {
    ticketStatusLabel,
    ITicket,
    ITicketStatusRequest,
    generateIntialTicketData,
    getInitialOnDataTicket,
    IStatusType,
    ticketTarget,
    IUSERROLE
};
